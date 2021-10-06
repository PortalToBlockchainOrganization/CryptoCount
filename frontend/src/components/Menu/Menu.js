import React from "react";
import classes from "./Menu.module.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Menu = (props) => {
	const [menuActive, setMenuActive] = React.useState(false);
	const wrapper = React.createRef();

	React.useEffect(() => {
		// add when mounted
		const handleMenuClick = (e) => {
			if (wrapper.current.contains(e.target)) {
				return;
			}
			setMenuActive(false);
		};
		if (menuActive) {
			document.addEventListener("mousedown", handleMenuClick); // return function to be called when unmounted
		} else {
			document.removeEventListener("mousedown", handleMenuClick);
		}
		return () => {
			document.removeEventListener("mousedown", handleMenuClick);
		};
	}, [menuActive, wrapper]);
	return (
		<div className={classes.MenuWrapper} ref={wrapper}>
			<div
				className={classes.MenuButton}
				onClick={() => setMenuActive(!menuActive)}
			>
				{props.label}
				<ExpandMoreIcon />
			</div>
			{menuActive && <div className={classes.Menu}>{props.children}</div>}
		</div>
	);
};

export default Menu;
