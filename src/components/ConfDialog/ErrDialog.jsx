import React from "react";
import { Modal, Button, ListGroupItem, ListGroup } from "react-bootstrap";
import { errorTranslate } from "../../api.js";

/**
 * Properties expected:
 * show: boolean
 * body: string
 * buttons: Array<string>
 * onClose: function to call upon close
 */

const Err = function (props) {
	return <ListGroupItem>{props.info}</ListGroupItem>;
};

const props = (props) => {
	var errItems = [];
	var keyNum = 0;
	Object.keys(props.body).length !== 0 &&
		props.body.forEach((err) => {
			errItems.push(
				<Err
					key={keyNum++}
					info={
						errorTranslate(err && err.tag) +
						" " +
						((err.params && err.params[0]) || "")
					}
				/>
			);
		});
	return (
		<Modal
			show={Boolean(props.show)}
			onHide={() => props.onClose("Dismissed")}
		>
			<Modal.Header closeButton>
				<Modal.Title>{props.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ListGroup>{errItems}</ListGroup>
			</Modal.Body>
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
