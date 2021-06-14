import React from "react";
import classes from "./History.module.css";

const History = ({ user }) => {
	console.log(user);
	return (
		<div className={classes.TableWrapper}>
			<table>
				<thead>
					<tr>
						<th>Address</th>
						<th>Fiat</th>
						<th>Basis Date</th>
					</tr>
				</thead>
				<tbody>
					{Object.keys(user.addresses).map((address, addressIdx) => {
						return (
							<tr key={addressIdx}>
								<td>{address}</td>
								<td>{user.addresses[address].fiat}</td>
								<td>{user.addresses[address].basisDate}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default History;
