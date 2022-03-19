async function saveRealize(realizing_obj) {
	//api post save with rebuilt object from realize
	let savedObject = {
		realizedBasisRewards: [],
		realizedBasisRewardsDep: [],
		realizedBasisRewardsMVDep: [],
		realxtzBasis: NaN,
		realBasisP: NaN,
		realBasisDep: NaN,
		realBasisMVDep: NaN,
	};
	//iterate over the realizing object and push onto realized, and rm from realizing
	for (i = 0; i < realizing_obj.realizingRewards.length; i++) {
		//savedObject.realizedRewards.push(savedObject.realizingRewards[i])    //raw rewards still not working
		savedObject.realizedBasisRewards.push(
			realizing_obj.realizingBasisRewards[i]
		);
		savedObject.realizedBasisRewardsDep.push(
			realizing_obj.realizingBasisRewardsDep[i]
		);
		savedObject.realizedBasisRewardsMVDep.push(
			realizing_obj.realizingBasisRewardsMVDep[i]
		);
	}

	savedObject.realxtzBasis = realizing_obj.realizingXTZBasis;
	savedObject.realBasisP = realizing_obj.realizingBasisP;
	savedObject.realBasisDep = realizing_obj.realizingBasisDep;
	savedObject.realBasisMVDep = realizing_obj.realizingBasisMVDep;

	// clear session in route end point instead
	// savedObject.realizingRewards = [];
	// savedObject.realzingRewardBasis = [];
	// savedObject.realzingRewardBasisDep = [];
	// savedObject.realzingRewardBasisMVDep = [];

	//adjust aggs

	return savedObject;

	//save the realize history object append to previous realize history object in db
}

