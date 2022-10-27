import React from "react";
import { useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import classes from "./History.module.css";
import { useHistory } from "react-router";
import Menu from "../Menu/Menu";
import Image from "../../Assets/Orgs/Tezos.png";


const History = ({ user, realizedHistory, getHistory, getSet, setParams, deleteSet }) => {
	const browserHistory = useHistory();
	// history component state
	const [history, setHistory] = React.useState([]);
	const [body, setBody] = React.useState([]);
	
	const pushToHistory = (data) => {
		let temp = history;
		temp.push(data);
		setHistory(temp);
	};
	console.log("user")
	console.log(user)
	const user_id = user._id
	console.log("user_id" + user_id)
	const getTableData = useCallback(() => {
		if (realizedHistory?.history?.length !== 0 && history?.length === 0) {
			getHistory(user_id, pushToHistory);
		} else {
			let temp = realizedHistory?.history;
			setHistory(temp);
		}
		// eslint-disable-next-line
	}, [
		realizedHistory?.history?.length,
		user?.setIds,
		getHistory,
		body?.length,
	]);

	React.useEffect(() => {
		const handleView = (id, address, fiat, date) => {
			console.log(id);
			getSet(id, user_id);
			setParams({ address: address, fiat, basisDate: date });
			browserHistory.push("/analysis");
        };
        
        const removeSet = (id) => {
			let temp = history.filter(obj => obj.id !== id);
			console.log("HISTORY W/ REMOVED: ", temp);
			// updating component state
			
            console.log(id)
            deleteSet(id);
			setHistory(temp);
        }

        getTableData();
        console.log(history, "This is History")
		let temp = history?.map((obj, objIdx) => {
			console.log('back in compenet')
			console.log(obj)
			return (
			// <div className={classes.wrap}>

			
				<tr  key={objIdx}>
					<td><img className="logo1" width="40" height="50" src={Image} alt="logo" /></td>
					<td>{obj.lastUpdated.split("T")[0]}</td>
					<td>{obj.address}</td>
					<td>{obj.fiat}</td>
					<td>{obj.basisDate.substring(0, 10)}</td>
					<td >
						<Menu>
							<div className={classes.Buttons}>
								<Button
									className={classes.Button}
									variant="outline-danger"
									onClick={() =>
										handleView(
											obj.id,
											obj.address,
											obj.fiat,
											obj.basisDate.substring(0, 10)
										)
									}
								>
									View
								</Button>
								<Button
									className={classes.Button}
                                    variant="danger"
                                    onClick={() =>
										removeSet(
											obj.id
										)
									}
								>
									Delete
								</Button>
							</div>
						</Menu>
					</td>
				</tr>
			// </div>
			);
		});
		setBody(temp);
	}, [getTableData, history, browserHistory, getSet, setParams, deleteSet, setHistory]);

	if (realizedHistory.isLoading) {
		return (
			<div className={classes.Wrapper}>
				<Spinner animation="border" variant="danger" />
			</div>
		);
	}
	
	if (realizedHistory?.isLoading === false && (realizedHistory?.history == null || realizedHistory?.history?.length === 0)) {
		return (
			<div className={classes.EmptyWrapper}>
				<div className={classes.Empty}>
					Loading your sets. 
					<div>
						<br />
					</div>
					<div>
						Paste your address in the{" "}
						<span
							className={classes.HomePageLink}
							onClick={() => browserHistory.push("/")}
						>
							{" "}
							enter page
						</span>{" "}
						to generate.
					</div>
				</div>
			</div>
		);
	}

	// if (
	// 	!realizedHistory?.isLoading &&
	// 	user?.setIds?.length >= 1 &&
	// 	!realizedHistory?.history
	// ) {
    //     console.log('just deleted a set',
    //     realizedHistory,
    //     user
    //     )
	// 	return (
	// 		<div className={classes.Empty}>
	// 			It looks like there was an error loading your sets.
	// 		</div>
	// 	);
	// }
	return history?.length >= 1 ? (
		<div className={classes.Page}>
			<div className={classes.Wrapper}>
				<table>
					<thead >
						<tr>
							<th >Blockchain</th>
							<th >Last Updated</th>
							<th >Address</th>
							<th >Fiat</th>
							<th>Basis</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody className={classes.Body}>{body}</tbody>
				</table>
			</div>
		</div>
	) : (
		<div className={classes.Wrapper}>
			<Spinner animation="border" variant="danger" />
		</div>
	);
};

export default History;
