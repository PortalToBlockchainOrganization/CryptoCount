import React from "react";

import BasisDatePicker from "../components/BasisDatePicker/BasisDatePicker";

export default {
	title: "Example/DatePicker",
	component: BasisDatePicker,
};

const Template = (args) => (
	<div className="w-25 py-5 my-5 mx-auto" style={{ width: "30%" }}>
		<BasisDatePicker {...args} />
	</div>
);

export const Primary = Template.bind({});
Primary.args = {
	primary: true,
	label: "DatePicker",
};
