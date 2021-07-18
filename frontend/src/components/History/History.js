import React from "react";
import { Spinner } from "react-bootstrap";
import classes from "./History.module.css";

const History = ({ user, realizedHistory }) => {
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

	if (
		(realizedHistory["history"] === undefined && user.setIds.length > 0) ||
		realizedHistory["isLoading"]
	) {
		return (
			<div className={classes.TableWrapper}>
				<Spinner animation="border" variant="danger" />
			</div>
		);
	}

	console.log(user.setIds.length);
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
