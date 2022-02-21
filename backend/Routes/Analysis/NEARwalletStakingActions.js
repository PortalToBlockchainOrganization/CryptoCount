https://github.com/near/near-wallet/blob/master/packages/frontend/src/redux/actions/staking.js



import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';
import { createActions } from 'redux-actions';

import {
    ACCOUNT_HELPER_URL,
    REACT_APP_USE_TESTINGLOCKUP,
    STAKING_GAS_BASE,
} from '../../config';
import { getLockupAccountId, getLockupMinBalanceForStorage } from '../../utils/account-with-lockup';
import { showAlert } from '../../utils/alerts';
import {
    MAINNET,
    getValidatorRegExp,
    getValidationVersion,
    TESTNET
} from '../../utils/constants';
import { setStakingAccountSelected } from '../../utils/localStorage';
import {
    STAKING_AMOUNT_DEVIATION,
    MIN_DISPLAY_YOCTO,
    ZERO,
    EXPLORER_DELAY,
    ACCOUNT_DEFAULTS,
    getStakingDeposits,
    lockupMethods,
    updateStakedBalance,
    signAndSendTransaction,
    stakingMethods,
    shuffle
} from '../../utils/staking';
import { wallet } from '../../utils/wallet';
import { WalletError } from '../../utils/walletError';
import {
    selectAccountId,
    selectAccountSlice
} from '../slices/account';
import { selectAllAccountsByAccountId } from '../slices/allAccounts';
import {
    selectStakingAccountsMain,
    selectStakingMainAccountId,
    selectStakingLockupAccountId,
    selectStakingAccountsLockup,
    selectStakingAllValidators,
    selectStakingAllValidatorsLength,
    selectStakingContract,
    selectStakingCurrentAccountAccountId,
    selectStakingFindContractByValidatorId,
    selectStakingLockupId
} from '../slices/staking';
import { selectStakingCurrentAccountbyAccountId } from '../slices/staking';
import { getBalance } from './account';

const {
    transactions: {
        functionCall
    },
    utils: {
        format: {
            parseNearAmount
        }
    },
    Account,
    Contract
} = nearApiJs;

export const { staking } = createActions({








UPDATE_ACCOUNT: async (balance, validators, accountId, validatorDepositMap) => {
    let totalUnstaked = new BN(balance.balanceAvailable);
    if (totalUnstaked.lt(new BN(STAKING_AMOUNT_DEVIATION))) {
        totalUnstaked = ZERO.clone();
    }
    let totalStaked = ZERO.clone();
    let totalUnclaimed = ZERO.clone();
    let totalAvailable = ZERO.clone();
    let totalPending = ZERO.clone();

    await Promise.all(validators.map(async (validator, i) => {
        try {
            const total = new BN(await validator.contract.get_account_total_balance({ account_id: accountId }));
            if (total.lte(ZERO)) {
                validator.remove = true;
                return;
            }

            // try to get deposits from explorer
            const deposit = new BN(validatorDepositMap[validator.accountId] || '0');
            validator.staked = await validator.contract.get_account_staked_balance({ account_id: accountId });

            // rewards (lifetime) = total - deposits
            //get transactions on validator/contract?
            validator.unclaimed = total.sub(deposit).toString();
            if (!deposit.gt(ZERO) || new BN(validator.unclaimed).lt(MIN_DISPLAY_YOCTO)) {
                validator.unclaimed = ZERO.clone().toString();
            }

            validator.unstaked = new BN(await validator.contract.get_account_unstaked_balance({ account_id: accountId }));
            if (validator.unstaked.gt(MIN_DISPLAY_YOCTO)) {
                const isAvailable = await validator.contract.is_account_unstaked_balance_available({ account_id: accountId });
                if (isAvailable) {
                    validator.available = validator.unstaked.toString();
                    totalAvailable = totalAvailable.add(validator.unstaked);
                } else {
                    validator.pending = validator.unstaked.toString();
                    totalPending = totalPending.add(validator.unstaked);
                }
            }

            totalStaked = totalStaked.add(new BN(validator.staked));
            totalUnclaimed = totalUnclaimed.add(new BN(validator.unclaimed));
            const networkId = wallet.connection.provider.connection.url.indexOf(MAINNET) > -1 ? MAINNET : TESTNET;

            validator.version = getValidationVersion(networkId, validator.accountId);
        } catch (e) {
            if (e.message.indexOf('cannot find contract code') === -1) {
                console.warn('Error getting data for validator', validator.accountId, e);
            }
        }
    }));
    
    // TODO: calculate APY

    return {
        accountId,
        validators: validators.filter((v) => !v.remove),
        selectedValidator: null,
        totalUnstaked: totalUnstaked.toString(),
        totalStaked: totalStaked.toString(),
        totalUnclaimed: (totalUnclaimed.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalUnclaimed).toString(),
        totalPending: totalPending.toString(),
        totalAvailable: (totalAvailable.lt(MIN_DISPLAY_YOCTO) ? ZERO : totalAvailable).toString(),
    };
},






GET_VALIDATORS: async (accountIds, accountId) => {
    const { current_validators, next_validators, current_proposals } = await wallet.connection.provider.validators();
    const currentValidators = shuffle(current_validators).map(({ account_id }) => account_id);
    if (!accountIds) {
        const rpcValidators = [...current_validators, ...next_validators, ...current_proposals].map(({ account_id }) => account_id);

        const networkId = wallet.connection.provider.connection.url.indexOf(MAINNET) > -1 ? MAINNET : TESTNET;
        const allStakingPools = (await fetch(`${ACCOUNT_HELPER_URL}/stakingPools`).then((r) => r.json()));
        const prefix = getValidatorRegExp(networkId);
        accountIds = [...new Set([...rpcValidators, ...allStakingPools])]
            .filter((v) => v.indexOf('nfvalidator') === -1 && v.match(prefix));
    }

    const currentAccount = wallet.getAccountBasic(accountId);

    return (await Promise.all(
        accountIds.map(async (account_id) => {
            try {
                const contract = new Contract(currentAccount, account_id, stakingMethods);
                const validator = {
                    accountId: account_id,
                    active: currentValidators.includes(account_id),
                    contract
                };
                const fee = validator.fee = await validator.contract.get_reward_fee_fraction();
                fee.percentage = +(fee.numerator / fee.denominator * 100).toFixed(2);
                const networkId = wallet.connection.provider.connection.url.indexOf(MAINNET) > -1 ? MAINNET : TESTNET;

                validator.version = getValidationVersion(networkId, validator.accountId);
                return validator;
            } catch (e) {
                console.warn('Error getting fee for validator %s: %s', account_id, e);
            }
        })
    )).filter((v) => !!v);
}




const total = new BN(await validator.contract.get_account_total_balance({ account_id: accountId }));





export const handleStakingUpdateAccount = (recentlyStakedValidators = [], exAccountId) => async (dispatch, getState) => {
    const { accountId, balance } = exAccountId
        ? selectAllAccountsByAccountId(getState(), { accountId: exAccountId })
        : selectAccountSlice(getState());

    const validatorDepositMap = await getStakingDeposits(accountId);

    if (!selectStakingAllValidatorsLength(getState())) {
        await dispatch(staking.getValidators(null, exAccountId));
    }

    const validators = selectStakingAllValidators(getState())
        .filter((validator) => Object.keys(validatorDepositMap).concat(recentlyStakedValidators).includes(validator.accountId))
        .map((validator) => ({ ...validator }));

    await dispatch(staking.updateAccount(balance, validators, accountId, validatorDepositMap));
};

how to get validator contract all callable terms
all transactions on valdiaotr contract