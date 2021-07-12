import React from "react";
import { Spinner } from "react-bootstrap";
import classes from "./History.module.css";

const History = ({ user, getHistory, realizedHistory }) => {
	// table body
	const body =
		realizedHistory["history"] !== undefined &&
		realizedHistory["history"].map((obj, objIdx) => {
			return (
				<tr key={objIdx}>
					<td>{obj.address}</td>
					<td>{obj.fiat}</td>
					<td>{obj.basisDate.substring(0, 10)}</td>
				</tr>
			);
		});

	console.log(realizedHistory["history"]);
	if (
		realizedHistory["history"] === undefined ||
		realizedHistory["isLoading"]
	) {
		return <Spinner variant="danger" />;
	}

	return user.setIds.length > 0 ? (
		<div className={classes.TableWrapper}>
			<table>
				<tr>
					<th>Address</th>
					<th>Fiat</th>
					<th>Basis Date</th>
				</tr>
				<tbody>{body}</tbody>
			</table>
		</div>
	) : (
		<div className={classes.Empty}>
			It looks like you don't have any realized history yet.
		</div>
	);
};

export default History;
