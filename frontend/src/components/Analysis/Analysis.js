import { chartOptions } from "./chartJsOptions";
import React, { useEffect, useState } from "react";
import { getData } from "./ChartData";
import { useHistory } from "react-router-dom";
import { Button, Spinner, Form, Modal } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import classes from "./Analysis.module.css";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
/**
 * Component for the Analysis page. Renders a chart displaying realized,
 * unrealized, and realizing sets. Allows user to query for sets, realize,
 * and save.
 * @param {*} props
 * @returns
 */
const Analysis = (props) => {
	const history = useHistory();
	const {
		params,
		set,
		getUnrealizedSet,
		//autoUnrealized,
		getRealizingSet,
		deleteParams,
		getSet,
		saveRealizing,
	} = props;
	// const [isLoading, setIsLoading] = useState(set["isLoading"])
	const [showModal, setShowModal] = useState(true);
	const [active, setActive] = useState("unrealizedBasisRewards");

	const quantityRealize = React.createRef();

	const updateChart = (setToRender) => {
		// update chart based on button press
		setCurrentSet(getData(setToRender, set, params, getUnrealizedSet));
		setActive(setToRender);
	};

	const goHome = () => {
		/* remove redux params and send user back to home if they choose not
		to overwrite */
		deleteParams();
		setShowModal(false);
		history.push("/");
	};

	const overwrite = () => {
		/* if duplicate parameters, then get the set off set ID and update 
		the currentSet to the response of the api call
		*/
		setShowModal(false);
		getSet(set["dupId"]);
		setCurrentSet();
	};

	const handleRealizing = (e) => {
		/* if there is set data and quantityRealize is not 0 then allow API
		request to get Realized
		*/
		e.preventDefault();
		if (set["data"]["_id"] !== undefined && quantityRealize !== 0) {
			getRealizingSet(
				set["data"]["_id"],
				quantityRealize.current.value,
				updateChart
			);
		}
	};

	const handleSave = (e) => {
		e.preventDefault();
		if (set["data"]["_id"] !== undefined) {
			saveRealizing(set["data"]["_id"]);
			// props.getHistory();
		}
	};

	// click handler
	const handleMax = (e /** DOM event, click */) => {
		// prevent page from refreshing
		e.preventDefault();

		// quantityRealize is Ref
		quantityRealize.current.value =
			set["data"]["unrealizedRewardAgg"].toFixed(0);
	};

	// chart js options
	const options = chartOptions(set);

	// load the fiat flag from directory
	let path = require(`../../Assets/Flags/${params.fiat}.PNG`);

	// const { register, setValue } = useForm();

	// current set data
	const [currentSet, setCurrentSet] = useState();
	// rerender the chart
	useEffect(() => {
		setCurrentSet(getData(null, set, params, getUnrealizedSet));
	}, [set, params, getUnrealizedSet]);

	// if duplicate address detected show duplicate modal
	if (set?.dupId) {
		return (
			<Modal show={showModal}>
				<Modal.Header closeButton>
					<Modal.Title>Duplicate Entry</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					It looks like you already have an existing object using
					these parameters. <br />
					<br />
					Do you want to continue and overwrite?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={goHome}>
						No
					</Button>
					<Button variant="outline-danger" onClick={overwrite}>
						Yes
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	// otherwise if the set data exists render the graph
	return set !== null && set?.isLoading === false ? (
		<div className={classes.AnalysisWrapper}>
			<div className={classes.Chart}>
				<div className={classes.ChartWrapper}>
					<Bar data={currentSet} options={options} />
					<div
						className={classes.help}
						tooltip-data="This chart shows your block rewards"
					>
						<HelpOutlineRoundedIcon className={classes.helpIcon} />
					</div>
				</div>
				<div className={classes.ChartParams}>
					<div>
						<div className={classes.Label}>Staking Basis: </div>
						<div className={classes.BarContainer}>
							<div className={classes.Bar}>
								{currentSet &&
								!isNaN(currentSet["realizingRatio"]) ? (
									<>
										<div
											className={classes.Realizing}
											style={{
												flex: currentSet
													? currentSet[
															"realzingRatio"
													  ]
													: null,
											}}
											tooltip-data={
												currentSet
													? `Realizing: ${(
															currentSet[
																"realizingRatio"
															] * 100
													  ).toFixed(2)}%`
													: null
											}
										>
											&nbsp;
										</div>
										<div
											className={classes.Unrealized}
											style={{
												flex: currentSet
													? 1 -
													  currentSet[
															"realizingRatio"
													  ] +
													  100
													: null,
											}}
											tooltip-data={
												currentSet
													? `Unrealized: ${(
															(1 -
																currentSet[
																	"realizingRatio"
																]) *
															100
													  ).toFixed(2)}%`
													: null
											}
										>
											&nbsp;
										</div>
									</>
								) : null}
							</div>
							<div
								className={classes.help}
								tooltip-data="Your staking basis powers your block rewards"
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
					</div>
					{/* <div>
						{data !== undefined ? data.basisPrice.toFixed(2) : null}
					</div> */}
					<div>
						<div className={classes.Label}>Basis Cost: </div>
						{set?.data?.basisPrice &&
							set?.data?.basisPrice.toFixed(2)}{" "}
						{/*{("   ", set["data"]?.fiat)} */}
					</div>
					<div>
						<img
							className={classes.fiatImg}
							src={path.default}
							alt={props.fiat}
						/>
						{props.fiat}
					</div>
					<div
						className={classes.help}
						tooltip-data="Your calculated basis cost from positive additions to your staking basis"
					>
						<HelpOutlineRoundedIcon className={classes.helpIcon} />
					</div>
				</div>
				<div className={classes.setToggles}>
					<div className={classes.basisSet}>
						<div className={classes.buttonAndInfo}>
							<Button
								variant={
									active === "unrealizedBasisRewards"
										? "danger"
										: "outline-danger"
								}
								onClick={() => {
									updateChart("unrealizedBasisRewards");
								}}
							>
								Basis Set
							</Button>

							<div
								className={classes.help}
								tooltip-data="Your basis set is your crypto's value with your basis price"
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
					</div>
					{/* <div className={classes.header}>Depletion Sets</div> */}
					<div className={classes.depletionSet}>
						<div className={classes.buttonAndInfo}>
							<Button
								variant={
									active === "unrealizedBasisRewardsMVDep"
										? "danger"
										: "outline-danger"
								}
								onClick={() =>
									updateChart("unrealizedBasisRewardsMVDep")
								}
							>
								Mvd Set
							</Button>
							<div
								className={classes.help}
								tooltip-data="Market Value Dilution accounting set"
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
						<div className={classes.buttonAndInfo}>
							<Button
								variant={
									active === "unrealizedBasisRewardsDep"
										? "danger"
										: "outline-danger"
								}
								onClick={() =>
									updateChart("unrealizedBasisRewardsDep")
								}
							>
								Supply Dep Set
							</Button>
							<div
								className={classes.help}
								tooltip-data="Circulating supply depletion accounting set"
							>
								<HelpOutlineRoundedIcon
									className={classes.helpIcon}
								/>
							</div>
						</div>
					</div>
				</div>

				{set && set["isLoading"] ? (
					<div className={classes.setToggles}>
						<Spinner animation="border" variant="danger" />
					</div>
				) : (
					<Form
						className={classes.setToggles}
						onSubmit={handleRealizing}
					>
						<Form.Label>Enter Quantity Realized:</Form.Label>
						<div className={classes.quantGroup}>
							<div className={classes.buttonAndInfo}>
								<Form.Control
									type="number"
									placeholder="0 XTZ"
									ref={quantityRealize}
									// {...register("Realize")}
								/>
								<div
									className={classes.help}
									tooltip-data="Enter a quantity of crypto you'd like to sell. "
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
								<div>
									<Button
										variant="primary"
										onClick={handleMax}
									>
										MaxRewards
									</Button>
								</div>
							</div>
						</div>
						<Button type="submit" variant="danger">
							Apply
						</Button>
					</Form>
				)}
				{currentSet && !isNaN(currentSet["incomeToReport"]) ? (
					<div className={classes.setToggles}>
						<Form.Label>Income to Report:</Form.Label>
						<div className={classes.quantGroup}>
							<div className={classes.buttonAndInfo}>
								{currentSet["incomeToReport"]
									.toFixed(2)
									.concat(" ", set["data"]?.fiat)}
								<div
									className={classes.help}
									tooltip-data="This is your fair reward income"
								>
									<HelpOutlineRoundedIcon
										className={classes.helpIcon}
									/>
								</div>
							</div>
						</div>
						<Button
							type="submit"
							variant="danger"
							onClick={handleSave}
						>
							Save
						</Button>
					</div>
				) : null}
			</div>
		</div>
	) : (
		<div className={classes.SpinnerWrapper}>
			<Spinner animation="border" variant="danger" />
			<div className={classes.SpinnerText}>Analyzing your data...</div>
		</div>
	);
};

export default Analysis;
