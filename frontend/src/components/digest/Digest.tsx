/* eslint-disable react/jsx-curly-newline */
import { FC } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";

import { IDigest, IDigestField, IState } from "../../types/interfaces";
import { setCorrectedData, setProcessedData } from "../../features/state";
import Button from "../Button";
import DigestSelect from "./DigestSelect";
import useDefaultDigest from "../../hooks/useDefaultDigest";

import "../../scss/components/digest/Digest.scss";

interface IDigestProps {
	digest: IDigest;
}

const Digest: FC<IDigestProps> = ({ digest }): JSX.Element => {
	const { modifiedDigest, setModifiedDigest } = useDefaultDigest(digest);

	return (
		<div className="digest">
			{modifiedDigest && (
				<>
					<div className="digest-content">
						<div className="digest-column">
							<DigestSelect
								title="Issuer Name"
								value={modifiedDigest.issuerName.name}
								digestFields={digest.issuerName}
								onChange={(value: string) =>
									setModifiedDigest({
										...modifiedDigest,
										issuerName:
											digest.issuerName[
												digest.issuerName.findIndex(
													(field: IDigestField) => field.name === value
												)
											],
									})
								}
							/>
							<DigestSelect
								title="Maturity Date"
								value={modifiedDigest.instrumentMaturityDate.name}
								digestFields={digest.instrumentMaturityDate}
								onChange={(value: string) =>
									setModifiedDigest({
										...modifiedDigest,
										instrumentMaturityDate:
											digest.instrumentMaturityDate[
												digest.instrumentMaturityDate.findIndex(
													(field: IDigestField) => field.name === value
												)
											],
									})
								}
							/>
							<DigestSelect
								title="Incorporation Place"
								value={modifiedDigest.issuerIncorporationPlace.name}
								digestFields={digest.issuerIncorporationPlace}
								onChange={(value: string) =>
									setModifiedDigest({
										...modifiedDigest,
										issuerIncorporationPlace:
											digest.issuerIncorporationPlace[
												digest.issuerIncorporationPlace.findIndex(
													(field: IDigestField) => field.name === value
												)
											],
									})
								}
							/>
						</div>
						<div className="digest-column">
							<DigestSelect
								title="Agent"
								value={modifiedDigest.agent.name}
								digestFields={digest.agent}
								onChange={(value: string) =>
									setModifiedDigest({
										...modifiedDigest,
										agent:
											digest.agent[
												digest.agent.findIndex(
													(field: IDigestField) => field.name === value
												)
											],
									})
								}
							/>
							<DigestSelect
								title="Denomination"
								value={modifiedDigest.denomination.name}
								digestFields={digest.denomination}
								onChange={(value: string) =>
									setModifiedDigest({
										...modifiedDigest,
										denomination:
											digest.denomination[
												digest.denomination.findIndex(
													(field: IDigestField) => field.name === value
												)
											],
									})
								}
							/>
							<DigestSelect
								title="Amount"
								value={modifiedDigest.instrumentAmount.name}
								digestFields={digest.instrumentAmount}
								onChange={(value: string) =>
									setModifiedDigest({
										...modifiedDigest,
										instrumentAmount:
											digest.instrumentAmount[
												digest.instrumentAmount.findIndex(
													(field: IDigestField) => field.name === value
												)
											],
									})
								}
							/>
						</div>
					</div>
					{/* <Button name="Save Digest" onClick={handleSave} /> */}
				</>
			)}
		</div>
	);
};

export default Digest;
