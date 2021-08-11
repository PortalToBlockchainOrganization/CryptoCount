import React from "react";
import { useCallback } from "react";
import { Spinner } from "react-bootstrap";
import classes from "./History.module.css";
import { useHistory } from "react-router";

const History = ({ user, realizedHistory, getHistory }) => {
	const browserHistory = useHistory();
	const [history, setHistory] = React.useState([]);
	const [body, setBody] = React.useState([]);

	const pushToHistory = (data) => {
		let temp = history;
		temp.push(data);
		setHistory(temp);
	};

	const getTableData = useCallback(() => {
		if (realizedHistory?.history?.length !== 0 && history?.length === 0) {
			getHistory(pushToHistory);
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
		getTableData();
		let temp = history?.map((obj, objIdx) => {
			return (
				<tr key={objIdx}>
					<td>{obj.address}</td>
					<td>{obj.fiat}</td>
					<td>{obj.basisDate.substring(0, 10)}</td>
				</tr>
			);
		});
		setBody(temp);
	}, [getTableData, history]);

	if (
		realizedHistory.isLoading === false &&
		realizedHistory?.history?.length === 0
	) {
		return (
			<div className={classes.EmptyWrapper}>
				<div className={classes.Empty}>
					It looks like you don't have any addresses yet.
					<div>
						<br />
					</div>
					<div>
						Go to the{" "}
						<span
							className={classes.HomePageLink}
							onClick={() => browserHistory.push("/")}
						>
							{" "}
							home page
						</span>{" "}
						to get started.
					</div>
				</div>
			</div>
		);
	}

	if (
		!realizedHistory?.isLoading &&
		user?.setIds?.length >= 1 &&
		!realizedHistory?.history
	) {
		return (
			<div className={classes.Empty}>
				It looks like there was an error loading your sets.
			</div>
		);
	}
	return history?.length >= 1 ? (
		<div className={classes.Page}>
			<div className={classes.Wrapper}>
				<table>
					<thead>
						<tr>
							<th>Address</th>
							<th>Fiat</th>
							<th>Basis Date</th>
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
