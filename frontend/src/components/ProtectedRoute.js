import React from "react";
import { Redirect, Route } from "react-router-dom";
const ProtectedRoute = ({ children, ...rest }) => {
	return (
		<Route
			{...rest}
			render={() => {
				return rest.isAuthed() === true ? (
					children
				) : (
					<Redirect to="/signin" />
				);
			}}
		/>
	);
};

export default ProtectedRoute;
