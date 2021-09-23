import React from "react";
import { useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import classes from "./History.module.css";
import { useHistory } from "react-router";
import Menu from "../Menu/Menu";

const History = ({ user, realizedHistory, getHistory, getSet, setParams }) => {
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
		const handleView = (id, address, fiat, date) => {
			console.log(id);
			getSet(id);
			setParams({ address: address, fiat, basisDate: date });
			browserHistory.push("/analysis");
		};

		getTableData();
		let temp = history?.map((obj, objIdx) => {
			return (
				<tr key={objIdx}>
					<td>{obj.createdAt.split("T")[0]}</td>
					<td>{obj.address}</td>
					<td>{obj.fiat}</td>
					<td>{obj.basisDate.substring(0, 10)}</td>
					<td className={classes.Actions}>
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
								>
									Delete
								</Button>
							</div>
						</Menu>
					</td>
				</tr>
			);
		});
		setBody(temp);
	}, [getTableData, history, browserHistory, getSet, setParams]);

	if (realizedHistory.isLoading) {
		return (
			<div className={classes.Wrapper}>
				<Spinner animation="border" variant="danger" />
			</div>
		);
	}
	if (realizedHistory?.isLoading === false && user?.setIds?.length === 0) {
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
							<th>Created At</th>
							<th>Address</th>
							<th>Fiat</th>
							<th>Basis Date</th>
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
