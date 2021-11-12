import { useEffect, useState } from "react";
import { copyObjectWithoutReference } from "../helpers/functions";
import { initialDigestState } from "../misc/initialData";
import { IDigest, IDigestData } from "../types/interfaces";

interface IUseDefaultDigest {
	modifiedDigest: IDigestData;
	setModifiedDigest: React.Dispatch<React.SetStateAction<IDigestData>>;
}

const useDefaultDigest = (digest: IDigest): IUseDefaultDigest => {
	const [modifiedDigest, setModifiedDigest] =
		useState<IDigestData>(initialDigestState);

	/**
	 * Set default values based on digest count property
	 */
	useEffect(() => {
		const digestState: IDigestData = copyObjectWithoutReference(modifiedDigest);

		// Loop through issuer info
		for (let i = 0; i < digest.issuerName.length; i++) {
			if (digest.issuerName[i].count > digestState.issuerName.count) {
				digestState.issuerName = digest.issuerName[i];
			}
		}
		// Loop through incorporation place
		for (let i = 0; i < digest.issuerIncorporationPlace.length; i++) {
			if (
				digest.issuerIncorporationPlace[i].count >
				digestState.issuerIncorporationPlace.count
			) {
				digestState.issuerIncorporationPlace =
					digest.issuerIncorporationPlace[i];
			}
		}
		// Loop through agent
		for (let i = 0; i < digest.agent.length; i++) {
			if (digest.agent[i].count > digestState.agent.count) {
				digestState.agent = digest.agent[i];
			}
		}
		// Loop through denomination
		for (let i = 0; i < digest.denomination.length; i++) {
			if (digest.denomination[i].count > digestState.denomination.count) {
				digestState.denomination = digest.denomination[i];
			}
		}
		// Loop through instrument amount
		for (let i = 0; i < digest.instrumentAmount.length; i++) {
			if (
				digest.instrumentAmount[i].count > digestState.instrumentAmount.count
			) {
				digestState.instrumentAmount = digest.instrumentAmount[i];
			}
		}
		// Loop through instrument amount
		for (let i = 0; i < digest.instrumentMaturityDate.length; i++) {
			if (
				digest.instrumentMaturityDate[i].count >
				digestState.instrumentMaturityDate.count
			) {
				digestState.instrumentMaturityDate = digest.instrumentMaturityDate[i];
			}
		}

		setModifiedDigest(digestState);
	}, [digest]);

	return { modifiedDigest, setModifiedDigest };
};

export default useDefaultDigest;
