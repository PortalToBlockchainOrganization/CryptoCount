import { chartOptions } from "./chartJsOptions";
import React, { useEffect, useState } from "react";
import { getData } from "./ChartData";
import { useHistory } from "react-router-dom";
import { Button, Spinner, Form, Modal } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import classes from "./Analysis.module.css";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
import jsPDF from "jspdf";
/**
 * Component for the Analysis page. Renders a chart displaying realized,
 * unrealized, and realizing sets. Allows user to query for sets, realize,
 * and save.
 * @param {*} props
 * @returns
 */
const Analysis = (props) => {
	const history = useHistory();
	const {
		params,
		set,
		getUnrealizedSet,
		//autoUnrealized,
		getRealizingSet,
		deleteParams,
		getSet,
		saveRealizing,
	} = props;
	// const [isLoading, setIsLoading] = useState(set["isLoading"])
	const [showModal, setShowModal] = useState(true);
	const [active, setActive] = useState("unrealizedBasisRewards");

	const quantityRealize = React.createRef();

	const updateChart = (setToRender) => {
		// update chart based on button press
		setCurrentSet(getData(setToRender, set, params, getUnrealizedSet));
		setActive(setToRender);
	};

    const numberWithCommas = (x) => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	const goHome = () => {
		/* remove redux params and send user back to home if they choose not
		to overwrite */
		deleteParams();
		setShowModal(false);
		history.push("/");
	};

	const overwrite = () => {
		/* if duplicate parameters, then get the set off set ID and update 
		the currentSet to the response of the api call
		*/
		setShowModal(false);
		getSet(set["dupId"]);
		setCurrentSet();
	};

	const handleRealizing = (e) => {
		/* if there is set data and quantityRealize is not 0 then allow API
		request to get Realized
		*/
		e.preventDefault();
		if (set["data"]["_id"] !== undefined && quantityRealize !== 0) {
			getRealizingSet(
				set["data"]["_id"],
				quantityRealize.current.value,
				updateChart
			);
		}
	};

	const handleSave = (e) => {
		e.preventDefault();
		if (set["data"]["_id"] !== undefined) {
			saveRealizing(set["data"]["_id"]);
			// props.getHistory();
		}
	};

	// click handler
	const handleMax = (e /** DOM event, click */) => {
		// prevent page from refreshing
		e.preventDefault();

		// quantityRealize is Ref
		quantityRealize.current.value =
			set["data"]["unrealizedRewardAgg"].toFixed(0);
	};

	const handleDownload = (e) => {
		e.preventDefault();

		var doc = new jsPDF()

		var myImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAG7AcADASIAAhEBAxEB/8QAHQABAAICAwEBAAAAAAAAAAAAAAYHAQUCAwQICf/EAE4QAAIBAwEEBgYGBwUECQUAAAABAgMEEQUGITFBBxJRYXGBEyKRobHBFBUjMkLwJDNSYnLC0YKSorLhQ1N00hY1NlRkc5Oz8URVY4SU/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAUGAQMEBwL/xAA1EQACAgECAwYEBgICAwEAAAAAAQIDBAUREiExBhMiQVFxFGGB0SMykaGxwUJSFeEkM/Fi/9oADAMBAAIRAxEAPwD8qgAAAAAAAAAAAAAAAAAAAAAAAAAABh9gS7jIBgYfYd9C0ubmapW1CdST4RhFyb8kb6w2A2pveq/q10Iv8VaShjye/wBxvqxrrv8A1xb9jZGqc/yojWGtzQwz26vptXSNQq6fVr0qs6D6spU23HrY3relw4eR413muUHCXDLqfDW3JhRk9yTMqlUfCDfkWB0XaFb3Su9Vu7eFWEcUaSnBSWeMn5LHtZY9OhQo5VGhTp8vVgl8CfwOz882lXOeyZJY+mzvrVm+yZ8+Rs7ubShb1JN8MRbOf1XqX/cLj/02fQnPf4DBIrspHzt/Y6Vo6/2Pnv6r1L/uFx/6bOqVtcQ+/RmvFH0Su7iN3YH2Uj5W/sP+H/8A0fObhNcYsxh9h9D1rOzr5Ve1o1M8etBP4nhuNmNnblYqaLZ+MaSi/ckaJ9lbf8LEa3pE10kUMC57ro52WuU1Ts6lB9tKq8/4so0t50S2kk3YatUp/u1aalnzWPgcNvZzNr6JP2ZolpmRHotysgTC96MNo7ZOVvGhdLj9nUw8eEsEbvdJ1PTpdS+sK9B/v03HPgRd2FkY72tg0cc6La/zRPGMMzjHFMPf2nNsajGGDL4cTDMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzv7Eemx0+91KvG2sbWpWqSe6MI5PqMHN8MVuzKTb2R5cM7ba2uLmapW9GdSb4RhFtvyRYOhdFk5dWvr1yoLj6Ci1nzlwXlnxRO9M0bS9Ipei02xpUFzcV60vGT3ssGF2cyL/Fd4V+5I0aZbZznyRV+kdGeuah1al6oWVJ781HmeP4V88Ew0zo22dscTuoVL2osZdVtR9kX8WSx794LRi6DiYy34eJ/Mlq9PpqSbW7Om1s7Sxp+js7WjQh+zTgor3I4anfU9L0+51Cr923pueOGXjCXm3jzPT5EI6U9WVrplDSqc8VLqfXms/gj8m2vYdWddDBxZzitkly29TbfNY9TkuRWF3cVbqvUua03KdWTnJvm28s6oRbfV4tmG84wSHYTSPrfaO2hKOaVB+nqZW7qx37+5vC8zzKqueTaoLrJlWri7ZqPmy19mNLWjaFaWPV6s1Dr1N345b3/AE8jaDdy4A9YorVFca49Eki3wrUIqKAANh9AADfYAAAAADcD/wCDjUhCrF06kFOLWGpJPJyBhrdbMbJ9SP6lsJs1qak3Yq3qS/HbvqNeX3fcQ/VeivULdSqaTeQuo/7ufqT9r3P2otAbuZFZWi4eVu5R2fquRyW4NNvVcz5+1DS7/TaroX9nVoTT4Tg1n+p5Gu4+hrqztb2i7e8tqVanL8NSCkv6kL1zousblSraLW+jVOPoqjcoPwlva8ys5nZu6neWO+JfuRV+lWQ5180VYMPsNlq2g6rotX0Oo2c6WdynxjLwktzNfjdw9hW7K51S4ZrZkXKLg9pcmcQHgNcD4MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABLJnHeAYw+w7KNKpVkqdKEpTk0lGKy2bbZ7ZbVNoq3UtKXVoxaU601iEf6vuRa+zuyOlbO01KhTVW5a9a4n95+H7K9/aS+naNfnvfbaPr9jtxcKzI5rkiGbPdGV3dKF1rtSVvS4qjHHpJLv5R977ixdO0vT9Jo/R9OtKdCnzUFhy8Xvb82erGAXvC0rHwFtWufqT+PiVY68C5ju5AAkDpAAM8l0MgpTbzVvrXaO5nCTdKg/QU9+7Edz9+WWvtNqq0bQru/6yU40+rT/jluXsbz5FEzzKTk+Led5T+1GVsoYy9/sQurW8o1o4xXMtTos0mNtplfVpw9e5l6OD/cjx9r+BWFrb1bq4p2tGPWnVmoRXa28Iv3SrCnpem22nUkurb01T3Li1xfm8s4uzWL3uS7muUenuzn0qrjtc/Q9Xb4gAvpYQAAAAAAAAAAAAAAAADAAQBncbb9Tquba2vKMre6oU6tKa9aE4ppkE2h6MKVRTudn6nUk9/wBHqS3P+GXyftLABw5enY+bHhtj9fM0X41d62mj57vbG7sLiVre286VSDw4yjhnmeewvzWtA0vXqDoahbKbS9WpFJTi+5/J7iqtp9h9S2elKtBO5s8+rWgvu90ly+BR9S0O/C8cPFD+PcgMrAnj+KPNEYw+wHLD4dhxZBnAAAYAAAAAAAAAAAAAAAAAAAAAAAMrABjDGDK8znSpzq1FTp05SlJ4Sit7fYZS35IdTjFZ3Y3k32R6Pa2p9TUNYjOjaP1oU+E6q+S7+fLtW42M6Pqdoqeqa5TU626VO3fCHfLv7uRPOBbtI7PuW12UuXkvuTOHp2+1lvT0Oq1tbayoQtbSjClSprEYxWEjtALlGKiuFdCbS4VsgAD6MgAAAZx7QYk4xTlJpKKbeeww+SBXXSvq+Ha6NTa3fpFVd/CK+PtRXWM7zZ7Tao9Z1q6v8vqTm1Tzygt0fdg1ccveuJ5bqeT8XlTtXTovYqWXb310pEu6NNJ+n6+rupDNOyi6m9buu90V8X5FvEV6N9J+rtn43NSGKt7L0ryt6it0fm/MlTL1oWL8Nhx36y5v6/8ARP6dV3VC36sAAmTuAAAAAAAAAAAAAAAAAAAAAAAABicYzi4TipRksNNJprswZAa4t0xt5Fe7XdHMZ9fUdnoYf3p2q+MP+X2dhW9WlUpTcKkZRlFtNSWGmfRTzgi21+w9pr8JXdmoUb5LKeMRq/uvsfYypatoCsTvxF7r7EPmaanvOkpvDGD0Xtlc6fcztLuhKlVpycZRlxTOh8FvKXKLg9n1INpp7MwAD5MAAAAAAAAAAAAAAAAAAAyu0wk3wRzpwnOShCOZNpJGUufIbbnOhSqV6io0YSnObSiorLbfItjYvYijo1OOo6lTjUvZb4wlvVH5ORjYjYqGi0o6jqVJSvqizGD3qin/ADd/ImHPPv5l30TRFUlkZC5+S9CewMBQXe2Ln5DfnfnPPIALUS/uAAZAAAAAAAI9t3q31Vs5cShLFW5+whj97i/YmSHfjdxKr6U9W+k6tS0unNunZwzL+OSX8qj7yJ1rK+Ew5SXV8l9Tjzru6ob82QiWe09ej2FXVNTt9PpZ61epGGccFne/BLf5HkeOPMnnRXpLr6jcapVp+rbR6kMr8cv6JP2nn+Bj/F5MKfVlcx63dYolmUaNO2owtqMerTpQjCMexJYOY88mG1GLnJpRXFvgeqcq49VyLftw8jI48DV3e1Gz1ks3GsWqa5RqKbXlHLNTc9Jmy9BtQr17jvp0v+bBy2ahi0/nsS+pplk1Q5SkkSoEErdLOlx3W+l3E1+9JR+GTzy6XaecrQZPxuV/yHJLXcCP+e5peoY8f8iw+4dxXEel2pn1tFi49irv+h2x6XaDfr6FNLuuM/ynwtfwH/mfK1HHf+RYQITQ6VtDnuuLK8pv91RkvijaWm3+yl01H6yVKT5Vacor28Dpr1XDt5RsRujl0T6TRIgdFrf2N8utZXlCuv8A8U1L4Hed8Zxmt4s3xnGXR7gD5A+jPuAAAAAAAAAAAABx3cnx7wAOSNFtTspZbS2zzildwj9lVx/hl2x96Ka1TTbzSrudle0JU6tN4afPvXaj6CNHtTstabS2nUqYpXUF9lWxw7pdq3Fd1nRY5idtC2mv3I3OwVd46+v8lHYa5A9mp6ZeaVd1LG+oSpVaTxJP3Y7u88bWCgSg4NxktmV1pp7MAA+TAAAAAAAAAAAAAAMx5gGYJvd2ss7o92OjbRp69qVL7WXrW8GvuL9trt7DSdH2yX1vc/Wt/SzZ0JerGXCtNcvBc/JFsd2clv7P6T3n/l3Ll5fcmdOw+La2Y5AAunuToAAMAAAAAAAADbcHVdXFK0tqt1Xk406UHObXYlllBane1NRv7i/rffr1JVH4tlp9Jmrqx0H6DTmlUvpqGP3I737+qvNlRS34KL2nyu8ujQukeb92QGq28VirXkZTW8nWhbd6Vs3oVKxtbCtc3Mm6lVykoQ679reEkuC4EDBAYuZbhyc6Xs+hHVXTolxQ6ku1HpM2kvMxoVaNrHspQ+cssjt5quoX8/SXt/Xry7alRy+LPGBdm5GQ97Zt/UTvsse8mcm3J5b95jJgHKajOd4bMAAbjKZgADJnPLcYAB20rirRalSrShJPKcXho32mbe7S6a0o37uIL8FddfPn973kcBvqybaHvXJr6myNs4c4vYtLSOlTT7hxpataTtpf7ym+tD2cV5ZJlYajY6nR9Pp93Tr08b3CWceK4rzPntHqsNQvNOrK5srmdGrF/ehJpk/idpsiraN64l+5IUapZDlZzR9B8s8gVxoHSlJONvr9FzXD6RTjvX8UefivYT+xvrPUaEbqxuadelLhKDz5P/XeW7C1LHzl+FLn6eZM0ZVd68L5noAHed50gAAwAAAAAADKeMvOEuL7EYSy14kF6RdrlZ0noVhVzWqx/SJp/ci191ePPu8TkzsyvBpds/8A6zTffHGg5y+hGOkHaG11vU4UrKnB0bSLgqqW+o873nms8PPtIm0cpPLyvMRjOb6qi2+OEjy/IvllWu2XVlUtsldNzfVnEGcb2mYfYaDWAAYAAAAAAAAAANrs1oVxtBqlKwopqL9apPG6EFxf554NbBSk1FLLe7HaXRsTs5HQNKTrwf0u6XXrvnHsh3Y597ZLaRp7z71Frwrr9vqdmFjPIs2fRdTd2NnbafaUrK0pqFKjFQjH88X2953jjvfHmD0uMFWlGK2RaElFbLoAAfRkAAAAAAADn3hcx15jgaTaPazStnKTVxP0ty1mFCL9Z97f4V3+w0O1/SHR07r6boc41LhZjOvnMYdyXN+4rG6ua11VlXuKkqlSbblOTy5PvZV9V7QRx96sbnL19CKy9SVe8Kuvqe7aDXr7aG9d9eyinwhCP3YR5JfnJqwCkWWStk5ze7ZAylKb4pPdgAGs+QAAAAAAAAAAAAAAAAAAFwAAOSfa0bDRtd1LRLn6Tp91Km8rrRz6sl2NczWheJ9wslXJSg9mfUZOD3iy5dmNvNO15Qtrnq2t7uXUk/Um/wB19vc/eSjdxxvfPGH4HzrTnKEusnhreWDsh0iTpOGm69PrUt0YXD3yiuyXau/kXLSu0Km1Vlvn6/cmsPUt9oWlkg4wnCpCNSnOMoyipRlF5TXJp9hy+W4tqe63JncAAyAAeTVNUtNHsauo3lRRp0Vntcnyil2vh/ofE5xri5z5JGJSUVxPoa3a/aajs3pzmnGV1XThRpveu+T7lu8SlbmvWuq07ivUdSpVk5TlJ5bbe9tnt1/W7vX9Qnf3Tx1t0IJ7oQ5RXh/VmtjxPNtW1KWo28vyLov7Kvm5TyZ7rp5GUm3hItbo+2Qjp1p9cahRTuLmGKcJr7lN8W0+bXu8SP8AR7sl9Z3H1zf082tCX2cZL9bNfJFqkz2e0ni/8q5eyf8AJ3abhqX4ti5eRTm3ey70DUfTWtN/QrluVN/sPnF+HLuIs8l+65o9trum1dOuUl6RfZzxvhPlL+q7Ci9QsLjTr2rY3NNwq0ZOMl3ojdd034G5zrXgl+z9Dlz8XuJ8S6M8oDygQJHgAAAAAAylkwdtrQq3VxTtqMHKpVkoQiubfAzFOT2RlLd7Ew6NtnfrLUnqlzTzb2TysrdKpyXlx9naWw+PLyNds/pFHQ9Jt9OpJZpxzUaX3pvfJ/nlg2J6fpOCsHGUPN837lpwqO4qSfXzAAJM6wAAAAAAAMce5bw+XNgNpJuTwlve/Ht7itNttvpV+vpOiVsUfu1a8Xhz7Uuxd/Mxt5tu7qU9F0mslQTxcVI8Kj5xX7vxK/k889/MpWt645t42O+S6sg8/O4m66uhl73yOLAKlvv1IYAAwAAAAAAAAAAAAAAAAAAAAAAAAAEAAZ9gTSZgAEv2M24r6HONhfylVsZPCWcuk3+KPzRbVC4oXVGFxbVY1KVSKcJx4Ncj54jw4kr2L20raDX+h3kpTsKr9aK402/xR+aLPo2tvGaoyHvHyfoSmDnupquzoXADhRr0rmlC4oVI1KdVKUJR4NPhg59vbhl6TUluujLCufNGJThCLnOSUYptttJLHjwKd252slr999Htaj+g27caa4ekfOT+XcSDpH2s6qns/p9XG/FzNPjj8Gfj4Ird793HwKT2h1bvp/C0vwrr7kDqOXxvuYPkuo5YybrZLZuvtHqStkpRoQxKtUX4Y9ni+C/0Ndp1hdane0rCzpOpWrSUYxS9/wAy7tnNCttntOhY2/VnP71WrznJ8/Ds7u/JH6Npbz7eKa8C6/Y5sHEeRPd9Ee+1taFlb07S2pqFKjFQhFcEl8fE7R4A9GjFRSS8izpKK2XQdu7JAek3Z1V6EdetaeZUsQr4W9x5S8nu9hPjruLejdUKlrcQU6VaLhOL5p8Tkz8SObRKqXXy9zRkUq+twf0PniRxNntFo9XQ9XuNOqJ4hLNOT/FB8H7Pma15R5bZXKqTrn1RU5RcW0zAANZ8gAABE56LtDV3qVTV69LNO0XVp9ZbnUafwW/2EIgpNqK57kXpsppC0TQrWycOrVcfSVd2/rvivLh5E92fwvicrjl0jz+vkSGnUd7dxPojb8QAei8izMAAGAAAAAAZHw5kF6Q9r1Y03oWn1cV6i/SJp76cX+Fd7+HiSDazaKls5pcrlOLuar6lvF85drXYs59naUjc16lzWncVqkp1KknKUm97b4sq3aDVXQvhqn4n1+S/7IjUsvu13cOvmcJPg857Ti3yAKNvuQAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyu8wDO4JrsHtk9IrLS9Rqv6DVbcW96oyfP8AhfNeZMttdqqez+nqlazi726jiks56kf238v9CmlLG9PedlxcV7hxdapKo4RUItvOIpYSXcTWPrd2PjPH6+j9DurzrK6nV+hxqTnVm6k5OUpNybby2zEOs2klvfDxMLLTaZP+jnZL6RUWv6hTzRpv9Hg196a/F4Ll3+DODDxbM65VQ6s56KZXz4Ykg2C2Tjodn9YX1P8ATbiOGmt9KHHq9zfNks8X+fz8BjHZ+eQPTsTErwqY01+Ra6qo0QVcOiAAOk2AAAdCD9J+hq50+GtUaf2tq+pUcedNvc/J49pVcj6Hu7WjfWtWzuI9anWg6cl3NY+ZQWq2FXS9Qr6fWTU6FRx8Vyfnx8yidpsJU3LIiuUuvv8A/CA1WjgmrI9H/J5AAVciQEDKWQCQ7CaT9bbRW9Occ0qH29TK3YjvSfc3heZdff7yCdFWlqjp1zqk4etcTVOLa/BHjjxb9xOz0Xs9jdxiKb6y5/TyLLplXd08XqAATxIAAAAAAAxOcKcJTqSUYxTcm+SW9/AyiH9JOvrTdKWmUZYrXuU9+9U1x9vD2nLmZMcSiVz8kar7VRW5sgO2O0E9odYqV1N/R6X2dCL3eoufi+JoHxOct/HkcGuB5ZddK+bsm92ypWTdknOXmAAaT4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWWDMdxncEi2M2XqbRX/wBqpRtKDUq0+3siu9lz0qNO3pwoUYKFOlFQhFLCjFbkvLgVr0V64qF3W0SrJKNfNajn9tLevNf5Sze5cEsYPQOzVNMcXvYc5PqWPS4QVXHHr5gAFiJIAAAAAAZ/qVh0raT6G+t9XpQ9S5j6OphcJx4e1Nexlnmg260xans1dwjHNShH08O7q73/AIckVrON8Vhziuq5r6HJnVd7S16FJNPsMHKSaeGcWjzIqoMwWXjvMG12WsPrLaCxs3DrRnWi5rtit8vcmfdVbtmq11b2PqEeKSj6l0bP2C0vRbOw6nVlSpLrrn1nvl72zYAHrdUFXXGEeiW36FxhHhiooAA2H0AAAAADKG5b28JFG7XazLW9dubuM80lJwpfwLcvbx8y1Nt9V+qdnLmrCWKtb7Cnv5yTz7slIy47ymdqMvxRxo+7/ogtVu3arQ7TDAKeQwAAAAAAAAAAAAAAAAMoAwDLT7DHvAGGDO8YfEzsDGGMMzncYbyNgAAYAAAAAAAAAAAAACxzYCW7IB6tOvKunXtG9oS6tShNTi+9F+WF5R1CyoX1u8068FUj3J8vE+e1x8S1ui7VvpekVdNqSzOzmnHL/BLL9zz7UWfszld3e6H0kv3JXSruCx1voyagAvhYQAAYAAABxnCFSEoVIqUJLEk+a5nIb+XHkYa3WwKA1ixlp2qXWn1E80K04b+aT4nhZMelCw+jbR/SYrddUYT8WvV/lT8yHs8nzafh8idXoyn3w7uxx+ZgmnRXZqvr9W5lHdbUJST7JNpfBshi4FmdEtp1bXULyS3VJwpp9mE2/wDMjr0Srvc6C9Of6G7Bhx3xRYAAPTi1AAAAAAAcN/ZvAMN7ArPpY1KUry00qMt1GDrTWfxS4Z8EveV++Ru9tL76w2lvq6eYqp6KH8MPVXuRo87jy3VL3kZdk/nt9EVLKs726UgACPOcAAAAAAAAAAAAAGYrIBjD7D0WNhe6hWVCytqtapLcowi2/cSjZHYO611Rvr+crexzu3etV/h7F3/HlaWmaVYaRb/RtOtYUYc+rulLxlxbLBp2gXZkVbZ4Yv8AVkji6dO9cUuSKy07ot1y6jGd9WoWcHxi315+xbvejd0eiSwiv0jV603+7SUfmye93IFoq7PYNSScd/dkrDTceC5rcgtbom0yUcUNUuYP96nGXzRqL/op1SgnLT76hcpfhl6kn7cr3logzboGDYtlHb2Z9T0+iS6FA6nouqaTU9DqFjVovLw5R3PwfB+R4Wu4+hrq0tr2jK3u6FOtTmsOM45yV1tZ0cO2hO/0CM6lNZc7fjJd8XzXdx73yreo9nbcVOdHiiv1RF5OmTp8UOaK9GDlKOMJmH2FaIswAAAAAAAAAAAAF4gAGeHMk/R1qf1dtLQpynineJ28ufH7v+JRIud1pWnbXFK4pS6s6c1OL7Gt6OjFudF0bV1TRsqm65qSPodeGAdNpcwvLWjd0/u16cai8JJP5ncesxkpxUl0+5cU+JboAA+gAAABv5cQACBdLNn1rKxv4rdSqSpSfPEkmv8AK/aVhLiXP0h2yudlLuXVzKi4VY+PWSfubKYZ532jq4M1y/2Sf9Fb1SHDkN+qC4Fw9GdD0OzMZ4/XVp1F7o/ylPLkXdsLT9Fspp8e2Epe2bZt7MR4sty9EfWlR3ub+RvgAX8sQAAAAAAOm9uI2dnXu5rMaFKVR+EVn5HcaXbO4dtsvqNVPe6Po/7zUfmaMqfdUzn6Js+LZcNcn8mUfVnKpVlUnJtybbb57zg+IYfaeSNtvcprAAMAAAAAAAAAAAGYoAJEv2C2RWu3L1C/hL6FQlvX+9n+z4dvyzkjOnWVfUr6lY20etUrzUIrvfyL50vTrfSdPoafaxxTowUc85PnJ97eWWDQNNWZd3ti8Mf5JHT8VXz4pdEemEIU4Rp04RhGCUYxisJJcMfnkZAPQkkuhZNlsl6AAGQAADIHt7AACuekTY6EYy1/TKSS43NOKwk/20viVzNYeMn0VVp061KVKrTU6c04yg1ukmsY+XmUbtZoc9A1qvY4k6WevSb5wfD+niih9otNjjyWRUtoy6+5XtTxlXLvILkzTADeVgigAAAAAAAAAAAAZj2GDKALr2BvPpuy1m5S60qXWpS7sPcvZgkJBuie5U9JvLXO+lXU/wC9HH8rJyepaTZ3uFXL5bfpyLZhy46IyAAJE6QAAAADG2/IM120VFXGg6jRazm1qtLvUW178FCS3PB9E1oRq0p05rMZxcX4NYPnerFxqSjLim0UvtXDx1z+TRBavHxRkYRfGy9N0tnNMhhL9Fpy9sc/MoePFF+7P/8AUGm/8HR/9uJr7Kr8eb+X9nzpC/Fl7HvABeSfAAAAAABF+kmq6WyteKf62rTh78/IlBD+lL/s1Df/APUw/wAsiO1V8OFY16HNmPaifsVHLiYfBAcjy7oVMAAwAAAAAAAAAAZXiYC4gE36K9Njc6zWv6kMxs6W54/HLcvd1i1t/MgnRLQUNKvbjDzUrqDf8Mc/zE7PSdAqVWDF/wC3Ms+mw4cdNeYABNHcAAAAAAAAACAdLGnKdnZ6rCKTpzdCb5tNZWfDD9pPyOdIVGNXZK9k1l0nTnHufXS+DZG6xUrsOxPyW/6czlzYcdEl6Ipd45nEzvTwzHJHlxVAAAAAAAAAAAAAEAECw+iOs43GpUFwlTpz9ja/mLK5tZyVb0TN/XF2s7nbP/PEtFd/E9G7OtvAjv6ss2mPfHSMgAnTvAAAAAA6mUsvC4nz5q1P0OpXVL9itNf4mfQXNFCbSQVLX9Rpr8F1Vj7JMqPateCt+5DavzjF+5ro8UX5s886Bpv/AAdH/wBuJQa3F77K1fS7N6bLOcW0I+xY+RydlX+PNfL+zTpD/Fl7G1ABeSfAAAAAABD+lL/s1D/iYf5ZEwIv0kUnV2VryX+yqU5+/HzI/VY8WFYvkzny1vRL2KafMcjMjDPLCpAAAAAAAAAAAAAJbgZiAWr0T1VLRLqjlZjc9b2xX/KTcrLomv1Tvb3TpNZr01Ujv5wb+UvcWa8cvE9K0GxWYENvLdFo0+XFjxS8gACZO0AAAAAAAAGQR7b+ahslf71lxgl3/aRJCQnpU1CNDR7axi/Xua3W/sxW/wB8o+wjtVsVWFZJ+jX68jmy5KNEn8iqX/8ABg5Pdg4nlxUgADAAAAAAAAAAAACBOuib/rm7f/hn/niWkituiKjJ3Go19+Iwpwe/tbf8pZX59x6P2di1gR39WWbTFtjpgAE4d4AAAAAHQblvfBbyhdp5KW0OpSTynd1Wn/aZfR8/azP0mq3k/wBqvUf+JlR7Vv8ADrXuQ2r8lFHkXIuzYKr6XZOweU3GM4+ycik1xLd6L6/pdmnTbX2NxOOOxNJ/Nkb2Znw5jj6pnNpUtrmvVEvAB6AWIAAAAAAGm2xtndbMajSXKi6n91qXyNyddzQjdW1a1n92tCVN57GmjRk197TKHqmj4tjxVyXyZ87vsMPidtxSnRrzpTWJQk089p1cTyWS2ezKc1s9gAD5MAAAAAAAAAAyjAANjs/qlTRdXttSprPoaicl2xe5r2Nl80K9K5owuKE1OnUipQl2ppNfE+d+0sbo42spxUdn9QqqOXi2m3uy8+o34vK8SzdnNRjj2Oix8pdPf/sldMyFXN1y6MsUDhx48+7u+AL6WH3AABgAAADvHBZfAc1nO/j4DZ78jIa5Nbyl9v8AW461r1R0anWt7ZehpNPc8cX5vPlgnHSBtXDSLJ6ZZTj9MuY9WXVf6uD4vxfAqSbbeW853lK7S6hGb+Fre+z3f2ILVMlS2pj5dTjz4mXjkYBUSGAAAAAAAAAAAAAW94BmPHgAWl0T23U0q8u8fra6h/djn+YnRHtgbL6FstZqUcSrdatLvy93uSJCepaTW6sKuPy/nmWzDjwURQABInSAAAAAAzEpRhCU546sU2/BI+dq8nOtOcnlyk22X5rtf6Not/XzhwtqjXj1XgoGe+TfeUrtXNcdcPTf+iD1eW8ooduGWR0R3Oaeo2bksp06kV7U/kVsTDouvVbbSegfC6ozp8ea9b+X3kNotvdZ1cvV7fryOHBn3d8WW6B3e3xB6d7FqAAAAAAAAMApLbmwdhtNe01FqNWfpovG5qW948G2vIj7LI6WNK6zs9XhHGU6FR++P8xXEu48u1bHePmWQ8t917MqeXX3V0kYABHHMAAAAAAAAAAAAZ4b8nKEsb00muDOAM7gs3Y7pEpzjT03X63VqRxGndS/Euyb457/AG9rn8ZxnFThNSjJZUljD8O3xPnRZW7Jv9E2x1rQcQtbjr0Vxo1PWh5Ll5NFp03tFKiKqyeaXn5kti6m4Lht5ou0EF0/pW0yqlHUrCtQnwcqb668d+H8TdUdvdlKyXV1eMW+U6cl7d2Cz1avhXLdWIlo5lE+kiQA0NTbnZSjnraxSb/dhOXwRqb/AKU9Ct4tWVvcXM+TfqRffl5fuPq3VMOpbysX6mZZdEebkiacN/sIjtZt9ZaNCdlpk4XF68xck04UvH9p93Dt7HCNb2/13WYzowqxtLeW506HquS/elxfwZGJPPPxK3qPaTvE68RfUisrU+Pw0ndeXdzf3E7u7uJVa1WTlOUnltnQ/EAqLk5Pd9SIbbe7AAMGAAAAAAAAAAAN4AO+yt6l3d0rWlFyqVZxhFdrbwjp37iV9G2lPUNoqdxKOadnF1XlbutjEffv8mdGJQ8i+NS82bKYOyxRRblpbQs7WjaU1iFGEacfBJHaM5B6zGKjFRXkXFR4Ul8gAD6AAAAACwARzpBula7K3frYlWcKUfOSb9yZS0k095Z/SzfKFhZWCe+pUlVe/wDZWF/mfsKwlxPO+0d3eZnD/qkv7K3qc+O/2Rg9+gX31brFnfNtRo1oyljnHO/3HgMxZB1zdc1NeTOCMuFpo+i0871we/PaZNRsnqC1PZ2xunLM/RKnPL39aPqt+7Jtz1uixXVRsj0a3LhXJTgpIAA2n2AAAAADJqdqdKWs6FdWSjmo49en/HHevbw8yiZqSk01vR9GcN+WimukDQ3o+v1alOHVt7tutTxwTf3l5PPk0VDtPhuUY5MfLk/byITVaeStRFwZxxMYKZsQgABgAAAAAAAAAAdwABl+Iz3mAAcsLiYT5GAZ3BnPJjJgDcBDIBgAAAAAAAAAAAAAAAAAyjKBnmW90baR9XaF9NqR6tW9l1843+jW6PzfmistntIq67q9DTqaeKks1JJfdgt7fsL3o0qdvSjQowUKdOKhGK5JLCXswWvsxhudjyZdFyXuS+lU8U3a/I5gAuxPAAGQAAABjOMcc+0HCtWp29GpcVZYhSi5yfYkstnzJ7JsN7cyo+k2/jebRu3g8xtaUae55WfvP/NjyIiz2areT1DULi/qfer1ZVGuzL4HjZ5Tm3fEZE7fVlPvn3lkpfMGY4zvMDJyGoszon1RSo3ekTl60H6emu1YxL4R9pYO5bly3FF7Jat9S67a3kpNU3L0dX+CW5/18i9OW49C7OZSuxe6b5x/jyLJpdveU8L6oAAsJIgAAAAAAju3OgrXNFm6VPr3NrmpR3b3+1Hvyl7UiRA0ZNEMmqVU+jRrtrVsHB+Z86SysHFkv6RNmnpGqO/taeLS8k5LC3Rn+KPd2r/QiLPLMrGniWypn1RUrapUycJeRgAHMawAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMbgAZiN+Td7J6BU2g1enaOMvQQanWkt2Irj5vgjbTTO+xVw6s+oQdklGPUnfRloP0PT5azcU8Vrv1aWeVPm+7Lz7ETb8+BxpUqdCnGjRgoU6aUYxSwkkcj1PBxY4VEaY+X8+ZbaKVRWoIAA6zcAAAAAACM9IWqLTtnK1OEsVLxqhHfye+T9ix5km47ipek/V1fa3DT6U807GPV/ty3y+S8iH1zK+Gw5NdZckcefd3VD+fJEOk+8w96MPs7AealWAAMA5R3PJdew2s/XOz9CVSea9t9hU373hbn5rHsZSSJf0b659Wa39CqzxRvsU3v3df8L83u/tE1oWZ8JlpS6S5P8Ao7tPv7m7n0ZbwHNg9J2LOAAAAAAAANtweHWtItdc02tp12vVqR3SXGEuUl4PHllFG6xpd5pF/VsL2m41KUmnzUl2p80z6AIzttspHaCy+kWsYq/oJuD4ekX7L7+z/Ur2u6V8ZUrql41+6I3UcTvlxx6opjD7AdtaFSlN0qkJRnBtNNb0+86mmnhnnzWxXOnJgAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnhAALzByS37lxMg50aVSvVjRpQcpzaiopb22XZshs5T2d0uNGUV9KrpSrzXb+z4LgRvo52S9BCG0GoUsVJLNtCS4L9t/Be0sDu37t3+heez2ldzH4m1c309if03E4F30+r6DjvxjO/HYAC0kuAADAAAAAHf2AHk1fUqWj6Zc6jW4UIOST5y5LzeF5lB3dxVu7ipdVpdapVm5yb5t7ywelLXVKdLQKE1iOK1ff+J/dXsefYVzI8+7R5qyMhUx6R/krup395bwR6L+TAAK6RgAAAOVKbhJTi2nFpprkcTMee8DoXlsjrsdf0WjdSkncU/s66/fXPzW/wBvYboprYPaP6i1dQr1MWt1inVy90eyXk/c2XLx3rg96712npei56zcZb/mjyf3LRg5Hf1c+q6gDuBMHaAAAAAAB+fz2gAz1IPt7sV9ZRnrOl0v0qC+2pxX61JcUlz+JVkouLw1hrij6LXHh+fz+eZCNtNg46m56to1PqXf3qlKO5Ve2S/e+PjkqOuaG7G8nGXPzRC5+A5/i1fUqnDB21aVSlJ06sJRnFtOLW9PsOplLa25EH0AAMAAAAAAAAAAAAAAAAAAAAAAAAAABdoAwwjLyZxjiZ6AKPZkm+wexT1OpHVtTpYs4P7OEv8Aay8P2fjwOOxWwdTVZQ1PVqcoWS306b3Os/lHv/8AktSnTp0qcaVKChCCUYxiklGK4JJcC06HoruayL14fJepL4OA57WWrkcsJbluS5Lh5AAvCSXJE8AAZAAAAAAAPJqmo2+lafX1C5f2dGDk0nvk+S83heZ6/IrDpN2j+k3cNCtamaVs+tXa51OS/sr35I7VM1YGO7H18jly71RVxeb6EN1O+r6lfVr65l1qtebnJrtfJdx43jkcpPdxOJ5fKUptzl1ZVZPibYAB8mAAAAEAAclyecFt9HW0q1bT/qq7qJ3dovVb3udPl7OHsKiPZpGpXOkX1LULSfVqUpZXY1zT7nwJLS8+WBkKzyfJ+x04mQ8exS8vM+geQPDour2muadS1GzkurU3ShnfTnzi/D5nu7z06uyNsFOD3TLXGSnFSj0YAB9mQAAAAAAAByHzIztXsTZbQwldUOrb3qW6oliM+6S+aKl1XSr/AEi6lZ6hbzpVIvmtz712+J9AbufwyeHV9G03W7Z22o2saq/C/wAUH2xlxXw8SvaroUM38SnlL9mR2Xp8b95w5SKAw+wYZMdpejvU9Ic7nT83tosvKj9pBfvL5r3EQkpL1WnlFGycS7EnwXR2ZX7aZ0vhmtjiDLWUGsYOfY1mAAYAAAAAAAAAAAAAAAAAMxAMYG8yly5m60DZPWNoKn6JbuFBPEq01iC8+b7kbaqbL58FabZ9RhKb2ijUUqNWtUjSpQlOcnhRistssjZHo5jScNR2gp5kt8LZ/Gf9CR7ObHaVs7FVKcfT3XOvNb/7K4L3vvN8uHyLnpfZ5VPvcrnL0JzE01Q2nb1MRSiuqopJbsJcPYZALVsS65LYAAyAAAAAAZAB13NzRs7epdXNRU6VKLnOT5Jc/wA/E+ZSUU2+hhyUVuzUbXbQ09ndJncKS+k1Mwt4vnLt8Ennxx2lIVqk61SVWpJylJttvi2bnazaGrtDqk7p5jRh6lCD/DDv7+Zo3nmeb6zqLzr/AAvwx5L7lXzcn4izl0XQAAh9ziAAMAAAAAAAGYmAnhAEm2L2pqbO3/UrNys7j1a0Vy/eXei5adWlXpwr0ainCrFSjJPdJNbn7D52XF95O9gdtI6fUjo2p1MW1R/ZVW/1Unyfdn2MtGgat3Evh7n4X0+RK6fmd0+6s6eRaAHfnPPP55b/AHgvS5rcsIABkwAAAAAAAAAPz3ke17YbRNdc67o/Rrl/7WksZffHhL3EhBovxqsmPBbHiRrsqhatprcpvW+j/XtJcqtKh9MoLf6Sgus0u+L3r4d5GJQlF4cWn4H0W/L5/nzNXquzGh6zl32n05VGv1kfVn/eXHzKvmdl4tuWNL6MirtJ38VTKGw+OAWTqnRNGTlU0jUsPlTrx/mX9CMahsLtNp6bnplStBfiofaZ8lv9qK7kaTmYv54Pb9SMsxLqusSOg7a1tcUJunWozpyXFSi00cMZzjkR8ouL2aOfZrqcQZ4hnyYMDGQZSfYAYw+wGcMzCnObUYRbb3YSMpN8glucRh9hu9P2P2j1HDt9IrqL3qVSPUj5OWEyT6b0UXdTEtV1ClSW59WlFzfteMe87sfTMrK/9cH/AAdFeLdb+WJXqTe5I3Wi7Ja7rck7Oxmqbf62ourBeb4+WS1NJ2H2b0nqzp2Ma9Vb/SV/Xfs+77jfpJJJcFuS7CwYnZaT2lkz+i+5I06TJ87WQzQujPStPca+rT+m1lv6nCmn4cX57u4mMIQpQjSpwjCEFiMUsJLs7PYcgWnFwqMOPDTHb+SXqoroW1a2AAOr3NvQAAyAAAAADAAAe7e13Aewxnd27mVd0i7XK+qPRdPrZt6Us1pJ/rJrl4LebrpA2yjp1KWi6bVTuqixWnH/AGUexfvMqubbw22+3JTu0Orb74lL5ef2ITUc1N91X9TDecdxhgFP3IUAAwAAAAAAAAAAAADKeEZi2t+eBxCM7gsnYLbiDjT0TWK33Xi3rTfshL5MsTD4c847X59586w3NvOGt6LH2J2+hKNPR9bq4e6FG4lyXJS/qW/RNc22x8l/JP7k1p+cl+Fa/qWGBlPgt3LeC5k2ua3AAAAAAAAAAAAAAMew280AANjO7Ouvb29zBwuKFOrF/hnBS+KNXc7IbM3X63RbZN/7uPU/y4NwOPLPz7jVPHqs/PFP6GqVNc/zJEO1Po82Qo29W9qfSLWlSi5ylTrZSS/iT/O7mVTc+gdaSt+sqfWfU6zTl1eWccyd9Je1CuK3/R+yqp06UutcST+9PlHwXx8CAPl2nnut2Yzv7rGikl1a82VzPdTt4altsYWeSJrsLsTR12lV1DVFUjbRfUpqL6rqS5vPZyI9s5olfX9Vo6fRyoyfWqzx9yC4svKztLewtaVnaU1CjRioQj3L4+J06BpazJu25bwX7s26did9LvJ/lRp7bYXZW1cZQ0mE2udScpZ8m8e421tp2n2axZ2NCh/5dOMfgj0Au1eHj08oQS+hPQprh+WKHPPPwAB0mzpyAAAAAAAAAAAAAAAAA59nLPYYT3M7DGWl2kU222zpbP2/0GxlGV/WjlY4UYv8T7X2DbPbahoVKVhYSp1L+a3p71RX73bLsXt7HUd3c3F5Wnc3VWVWrUk5TnJ5bb5tlX1vW40p4+O/F5v0IjPzlWu7rfM41qtStVlVq1HOc25Sk3ltnWwCjOTlzZAdQADAAAAAAAAAAAAAAAABlMwADO7nvMxws78fI4jBkE82N6QJWCp6XrU5VbVLq06r3ypLsfbH3r3Fn0q1O4pxr0akalOp60Zxaaku1YPnVbiS7Lba3+ztVUpL09nJ+vRb4d8Xyfu+KtGka88dKjJe8fJ+hLYeouvwW80XODw6RrWna5aq7064VSO7rRe6UH2SXb7u9nuLvXONsVKD3TJ6MlOKlF7oAA+z6AABgAAAAAAADi8doANDtjtHT2d0mdSEl9KrpwoR7+cvLj7FzNzc3FC0t53dxUUKNKLnOT5RXEpDanXq20Wq1LyacaS9WlD9mHLz5vvZB65qSwaeCD8cun3ODUMn4eHCurNVVqTq1JVKk3OUn1nJvLbMQjKbUUus29yXMxHPFE76NNmPpdz9eXtP7G3liims9ap+14L447GUTDxbM25VQ6sr9NUr7OFEu2J2ajs/padeL+mXKUq75xXFQ8ufeyRb28vjzHDC3cOQPUMbGhiVRpguSLZVVGmKhHogADefYAAAAAAAAAAAAAHcYAAOq6u7axt53d3cQo0YLfUm8Jf18OZiUowTc+QfJbs7d/Fcfz7CD7ZdINLT1U0zQ6kalxvhUrLfGn2pdsu80e1vSJW1JT0/RZTt7V+rKo906n9F79/iiEVJdZ5yU7Vu0Da7jFfu/sQmZqW/gp/U5VqtSvUdWrUc5ybcpSeW32s634gFQbb5shQADAAAAAAAAAAAAAAAAAAAAAAAXPeAAOXEyuHEwBuD26Zqt/pF1G70+5lRqR5xe5rsa5ruLQ2Z6RNP1ZRtdUcLS6+7l/q5vuz93wKiMweHkktP1S/T5eB7x80dOPlWY78L5H0WsYyuHuMlNbO7e6tofUt6k/pVqt3oqj3xX7r5e9dxZmh7W6Lr8UrS4UKz40ajSnn+by9xecDWcfOSSfDL0ZYMfOryEl0ZuQN3LkCYOwAcd6BgAAGQA96wDR7X7RU9nNKnXUl9Jq5hQi/2sb5eCTz7FzNN98Mep22dEfFlkaoucuiIl0lbT+kqPZ6zqrqwadzJc5LhFdy4+JXry8Y3+HI5VpzrVJVZycpSblKT3tvtZiCk2kuL3Hl+blzzr3bPz6e3oVO+6V83ORstndEuNe1Slp9BNKXrTnjdCC4tl42NlbadaUrG0pqFKjFQivzx8TRbD7MrZ/S1UuIL6ZcrrVc8YrlBfPvZJPz5l40LTVh0qya8cv2XoT+n4vcQ4pfmYABPEgAAAAAAAAAAAAAB8jC59DIBr9X1/StDo+l1G8hSyvVhxnPwjz/O9FdbQdJmo6h1rfSIuyoPd1+tmrJeP4fL2kZnavjYK2k95eiOTIzKsfq+ZNto9s9I2eg6VScbi6XChTe9fxPkVTtBtPqm0Vx6a9r4px+5Si8QivDt73vNXVqSqSc5Sbk222+J1vHYUfUNYvz3s3tH0X9kBk5tmS9nyRlvmYYBEHGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmAAZ3dhyhUlCSnCTi1vynjBwBlPboPmTDQ+knWdMUaF61fUFuSqP7SK7p/1J9o+3Gz+s9WFO8VvWe70VfEXnsUs4ftKROUXjfnBNYWvZeL4W+Jej+53UahbRyfNH0XnO/tBRmk7Xa9ouIWeoT9Gnn0U/Wh7HwJhpfSxTklT1jTZRfOpby3f3X/zFmxe0mLckrd4v9iVq1OqfKfJlh9w4cTTafths3qKSttVoxk/wVX1Hn+1j3G5jKLSlF7nvWOZOVZFdy4q5J+zO+FsJ84Pc669xStaM7mvUUKdKLnKT4RS4v8APxKR2s2grbRarO6l1o0YepRg/wAMFw83xfiSzpM2mTf/AEds6q6sd9xJPnyj5cX3ldtLil/oUrtFqffWfDVvwx6/NkFqWUrJd1HojCy1w7ycdG+zH1hdvW7ym3QtpYpJ8J1Fz8Fx8cd5Gdn9GuNd1Ojp9vuc3mc8ZUILi3+e7mXjYWNtptnSsbSn1KVGPUiueO/vy234mvs/pvxNnfWrwx/d/wDR86bi99LvJdF/J6N3Fc94AL8ixAAGQAB3mDIABkfIAGu1DaHRNLyr7U7elKPGHWzP+6ss12WwpW9jS92fEpxhzkzYjdzINqnSrp1BOGl2VS4mtynUfUj7OL9xDtW282j1ZOE7z6PSf+zoeqvbxfmyEye0WJTuq3xP5dP1OG7Uqa+S5stTV9qtC0WMo3t7D0iz9lB9afsXDzx4kC1vpR1G7UqOkUlaU3u9JL1qjXdyXlv7yESm5vrSbb7WcWVrN7QZWVuoeFfIir9Rtu5Lkjtubq4u6sri6r1K1SbzKU5OTfmzqeN2DAIGUnLmzgbb6meHYYAG/kYAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAymYBlPYHKMkt6bR7LPWdUsH+hajcUE/wDd1ZR+DPCD6jOUHvB7GVJx6M7a1WrcVJVq1RzqVG5SlJ5bfazgsc8HEHy3u9xvvzZO9htp9mNn7af0yNyrutL16qppxUFwS358dxNKO3eytVLq6vCLf7cZx3/3cFIAm8TXsjDrVUEuFHdTqFlMVFJbF9U9p9nKqzHXLFeNeMfjg7VruhvetZsX/wDsQ/qUAcuEUzvXaq7zrX6s6Fq811ii/frzRf8A7xY//wBEP6nGW0WgU03LXLBY/wDEQz8ShOTMNmX2ru8q1+5n/l5/6ovGrtpstR+/rNB4/ZzP4JnhuuknZS23wuK1f/y6L/mwU2DRPtRlv8qSNUtVufRItC66W7CGfoelVqnY6lRQ+GTSXvSrr9bMbSja28eTUXOS/vbvcQoHBbredb/nt7GiefkT5ORttQ2p2g1NSjd6vczhP70FNxi/JbvcauU2+bficQRs7rLXvN7+5yynKT3kxkzlYMA1nyZ5b2YfcAAAAAAAAAAAAAAAAAAAAAAAAAAf/9k=' 
		doc.setFontSize(18);
		doc.addImage(myImage, 'JPEG', 20, 25, 23, 23, 'PTBO Logo');
		doc.text("STATEMENT OF TEZOS BLOCK REWARD INCOME", 50, 35)
		doc.setFontSize(12);
		doc.text("PORTAL TO BLOCKCHAIN ORGANIZATION", 50, 40)
		doc.setFontSize(10)
		doc.text("CALCULATED BY CRYPTOCOUNT", 50, 45)
		//doc.addImage(tezLogo, 'JPEG', 20, 25, 23, 23, 'Tezos Logo');
        doc.text("HOST BLOCKCHAIN: TEZOS " , 25, 60)
        doc.text("TEZOS DELEGATOR ADDRESS: " + set["data"]["address"], 25, 67)
        doc.text("FIAT: " + set["data"]["fiat"], 25, 74)
          var qRewSold = set["data"]["realizingRewardAgg"].toFixed(2)
        doc.text("PERIOD START: " + set["data"]["realizingRewards"][0]["date"], 25, 88);
        var last = set["data"]["realizingRewards"].length
        doc.text("PERIOD END: " + set["data"]["realizingRewards"][last - 1]["date"], 25, 95);
        doc.text("QUANTITY OF REWARDS SOLD: " + numberWithCommas(qRewSold) + " XTZ", 25, 109)
        doc.text("AVERAGE BASIS COST: " + set["data"]["basisPrice"].toFixed(2) + " " + set["data"]["fiat"], 25, 116)
        doc.text("TRUE REWARD INCOME: "+ numberWithCommas(currentSet["incomeToReport"].toFixed(2)) + " " + set["data"]["fiat"], 25, 123)
        //var doc = [props][pdfDocument]
        //doc.setFontSize(12)
        doc.text("CALCULATED ON BEHALF OF", 25, 137)

        doc.text("NAME: " + set["firstName"] + ' ' + set["lastName"], 25, 144)
        doc.text("EMAIL: " + set["email"], 25, 151)


        doc.save("TezosRewardIncomeStatement.pdf")
    };


	// chart js options
	const options = chartOptions(set);

	// load the fiat flag from directory
	let path = require(`../../Assets/Flags/${params.fiat}.PNG`);

	// const { register, setValue } = useForm();

	// current set data
	const [currentSet, setCurrentSet] = useState();
	// rerender the chart
	useEffect(() => {
		setCurrentSet(getData(null, set, params, getUnrealizedSet));
	}, [set, params, getUnrealizedSet]);

	// if duplicate address detected show duplicate modal
	if (set?.dupId) {
		return (
			<Modal show={showModal}>
				<Modal.Header closeButton>
					<Modal.Title>Duplicate Entry</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					It looks like you already have an existing object using
					these parameters. <br />
					<br />
					Do you want to continue and overwrite?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={goHome}>
						No
					</Button>
					<Button variant="outline-danger" onClick={overwrite}>
						Yes
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	// otherwise if the set data exists render the graph
	return set !== null && set?.isLoading === false ? (
		<div className={classes.AnalysisWrapper}>
			<div className={classes.Chart}>
				<div className={classes.ChartWrapper}>
					<Bar data={currentSet} options={options} />
					<div
						className={classes.help}
						tooltip-data="This chart shows your block rewards"
					>
						<HelpOutlineRoundedIcon className={classes.helpIcon} />
					</div>
				</div>
				<div className={classes.ChartParams}>
					<div>
						<div className={classes.Label}>Staking Basis: </div>
						<div className={classes.BarContainer}>
							<div className={classes.Bar}>
								{currentSet &&
								!isNaN(currentSet["realizingRatio"]) ? (
									<>
										<div
											className={classes.Realizing}
											style={{
												flex: currentSet
													? currentSet[
															"realzingRatio"
													  ]
													: null,
											}}
											tooltip-data={
												currentSet
													? `Realizing: ${(
															currentSet[
																"realizingRatio"
															] * 100
													  ).toFixed(2)}%`
													: null
											}
										>
											&nbsp;
										</div>
										<div
											className={classes.Unrealized}
											style={{
												flex: currentSet
													? 1 -
													  currentSet[
															"realizingRatio"
													  ] +
													  100
													: null,
											}}
											tooltip-data={
												currentSet
													? `Unrealized: ${(
															(1 -
																currentSet[
																	"realizingRatio"
																]) *
															100
													  ).toFixed(2)}%`
													: null
											}
										>
											&nbsp;
										</div>
									</>
								) : null}
							</div>
							<div
								className={classes.help}
								tooltip-data="This is a representation of your staking basis."
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
					</div>
					{/* <div>
						{data !== undefined ? data.basisPrice.toFixed(2) : null}
					</div> */}
					<div>
						<div className={classes.Label}>Basis Cost: </div>
						{set?.data?.basisPrice &&
							set?.data?.basisPrice.toFixed(2)}{" "}{set?.data?.fiat}{" "}
						{/*{("   ", set["data"]?.fiat)} */}
					</div>
					<div>
						<img
							className={classes.fiatImg}
							src={path.default}
							alt={props.fiat}
						/>
						{props.fiat}
					</div>
					<div
						className={classes.help}
						tooltip-data="The weighted average cost of additions to your staking basis"
					>
						<HelpOutlineRoundedIcon className={classes.helpIcon} />
					</div>
				</div>
				<div className={classes.setToggles}>
					<div className={classes.basisSet}>
						<div className={classes.buttonAndInfo}>
							<Button
								variant={
									active === "unrealizedBasisRewards"
										? "danger"
										: "outline-danger"
								}
								onClick={() => {
									updateChart("unrealizedBasisRewards");
								}}
							>
								FMV Set
							</Button>

							<div
								className={classes.help}
								tooltip-data="Rewards times average basis cost, no depletion."
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
					</div>
					{/* <div className={classes.header}>Depletion Sets</div> */}
					<div className={classes.depletionSet}>
						<div className={classes.buttonAndInfo}>
							<Button
								variant={
									active === "unrealizedBasisRewardsMVDep"
										? "danger"
										: "outline-danger"
								}
								onClick={() =>
									updateChart("unrealizedBasisRewardsMVDep")
								}
							>
								MV Dilution Set
							</Button>
							<div
								className={classes.help}
								tooltip-data="Fair market value rewards with market value depletion added to the entries."
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
						<div className={classes.buttonAndInfo}>
							<Button
								variant={
									active === "unrealizedBasisRewardsDep"
										? "danger"
										: "outline-danger"
								}
								onClick={() =>
									updateChart("unrealizedBasisRewardsDep")
								}
							>
								Supply Depletion Set
							</Button>
							<div
								className={classes.help}
								tooltip-data="Fair market value rewards with depletion by supply additions added to the entries."
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
					</div>
				</div>

				{set && set["isLoading"] ? (
					<div className={classes.setToggles}>
						<Spinner animation="border" variant="danger" />
					</div>
				) : (
					<Form
						className={classes.setToggles}
						onSubmit={handleRealizing}
					>
						<Form.Label>Enter Quantity Realized:</Form.Label>
						<div className={classes.quantGroup}>
							<div className={classes.buttonAndInfo}>
								<Form.Control
									type="number"
									placeholder="0 XTZ"
									ref={quantityRealize}
									// {...register("Realize")}
								/>
								<div
									className={classes.help}
									tooltip-data="Enter a quantity of crypto you'd like to sell, realizes in FIFO manner, or select the MAX button. "
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
								<div>
									<Button
										variant="primary"
										onClick={handleMax}
									>
										MAX
									</Button>
								</div>
							</div>
						</div>
						<Button type="submit" variant="danger">
							Generate
						</Button>
						<div
									className={classes.help}
									tooltip-data="Generate your true income statement."
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
					</Form>
				)}
				{currentSet ? (
					<div className={classes.setToggles}>
						<Form.Label>Income to Report:</Form.Label>
						<div className={classes.quantGroup}>
							<div className={classes.buttonAndInfo}>
								{isNaN(currentSet["incomeToReport"]) ? ('0.00') : (numberWithCommas(currentSet["incomeToReport"]
									.toFixed(2))
									.concat(" ", set["data"]?.fiat))}
								<div
									className={classes.help}
									tooltip-data="This is your fair reward income"
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
							</div>
						</div>
						<Button variant="danger" disabled={isNaN(currentSet["incomeToReport"])} onClick={handleDownload}>Download Statement</Button>
						<Button
							type="submit"
							variant="danger"
                            onClick={handleSave}
                            disabled={isNaN(currentSet["incomeToReport"])}
						>
							Save
						</Button>
						<div
									className={classes.help}
									tooltip-data="Save this realization or enter a new quantity."
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
					</div>
				) : null}
                {currentSet ? (
                    <div className={classes.setToggles}>
                            <Form.Label>Period Start:</Form.Label>
                        <div className={classes.quantGroup}>
                            <div className={classes.buttonAndInfo}>
                                {console.log(currentSet)}
                                {(isNaN(currentSet["incomeToReport"]) ||  set["data"]["realizingRewards"] === undefined) ? ('N/A') : (set["data"]["realizingRewards"][0]["date"])}
                                <div
                                    className={classes.help}
                                    tooltip-data="This is the start of your income period"
                                >
                                    <HelpOutlineRoundedIcon
                                        className={classes.helpIcon}
                                    />
                                </div>
                            </div>
                        </div>
                    <div >
                            <>Period End:</>
                        </div>
                        <div className={classes.quantGroup}>
                            <div className={classes.buttonAndInfo}>
                                {(isNaN(currentSet["incomeToReport"]) ||  set["data"]["realizingRewards"] === undefined) ? ('N/A') : (set["data"]["realizingRewards"][set["data"]["realizingRewards"].length - 1]["date"])}
                                <div
                                    className={classes.help}
                                    tooltip-data="This is the end of your income period"
                                >
                                    <HelpOutlineRoundedIcon
                                        className={classes.helpIcon}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ): null}
			</div>
		</div>
        
	) : (
		<div className={classes.SpinnerWrapper}>
			<Spinner animation="border" variant="danger" />
			<div className={classes.SpinnerText}>Analyzing your data...</div>
		</div>
	);
};

export default Analysis;
