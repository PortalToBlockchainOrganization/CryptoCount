import styled from "styled-components";
import {
	FormGroup,
	Label,
	Input,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
} from "reactstrap";

export const DatePickerContainer = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
`;

export const DatePickerFormGroup = styled(FormGroup)`
	display: flex;
	justify-content: space-between;
	position: relative;
	width: 100%;
	border: 2px solid #dc3545;
	border-radius: 5px;
	overflow: hidden;
`;

export const DatePickerLabel = styled(Label)`
	margin: 0;
	padding: 0 2rem;
	font-weight: 600;
	font-size: 0.7rem;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: #dc3545;
	border-right: 2px solid #dc3545;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const DatePickerInput = styled(Input)`
	padding: 1rem 2rem;
	font-weight: 500;
	font-size: 1rem;
	color: #333;
	box-shadow: none;
	border: none;
	text-align: center;
	letter-spacing: 1px;
	background: transparent !important;
	display: flex;
	align-items: center;

	::placeholder {
		color: #999;
		font-size: 0.9rem;
	}
`;

export const DatePickerDropdown = styled(Dropdown)`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
`;

export const DatePickerDropdownToggle = styled(DropdownToggle)`
	position: absolute;
	width: 100%;
	height: 100%;
	background: transparent;
	opacity: 0;
	filter: alpha(opacity=0);
`;

export const DatePickerDropdownMenu = styled(DropdownMenu)`
	position: absolute;
	top: 0;
	left: 0;
	border: none;
	padding: 0;
	margin: 0;
	height: 595px;
	width: 590px;
	overflow-y: hidden;
	transform: translateX(-75px) translateY(-250px) !important;
`;
