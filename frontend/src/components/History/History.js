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

	if (realizedHistory["isLoading"]) {
		return (
			<div className={classes.TableWrapper}>
				<Spinner animation="border" variant="danger" />
			</div>
		);
	}

	if (
		!realizedHistory["isLoading"] &&
		user["setIds"].length > 1 &&
		realizedHistory["history"] === undefined
	) {
		return (
			<div className={classes.Empty}>
				It looks like there was an error loading your sets.
			</div>
		);
	}
	return user.setIds.length > 0 ? (
		<div className={classes.TableWrapper}>
			<table>
				<thead>
					<tr>
						<th>Address</th>
						<th>Fiat</th>
						<th>Basis Date</th>
					</tr>
				</thead>
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
