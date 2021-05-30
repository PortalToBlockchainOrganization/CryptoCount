import React from "react";
import { Modal, Button } from "react-bootstrap";

/**
 * Properties expected:
 * show: boolean
 * body: string
 * buttons: Array<string>
 * onClose: function to call upon close
 */

const props = (props) => {
	return (
		<Modal show={props.show} onHide={() => props.onClose("Dismissed")}>
			<Modal.Header closeButton>
				<Modal.Title>{props.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{props.body}</Modal.Body>
			<Modal.Footer>
				{props.buttons.map((btn, i) => (
					<Button
						key={btn}
						onClick={() => {
							props.onClose(btn);
						}}
					>
						{btn}
					</Button>
				))}
			</Modal.Footer>
		</Modal>
	);
};

export default props;
