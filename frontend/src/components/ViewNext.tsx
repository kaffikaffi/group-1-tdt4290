import { FC } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { scrollToElementId } from "../helpers/functions";

import "../scss/components/ViewNext.scss";

interface IViewNextProps {
	elementId: string;
	offset: number;
}

const ViewNext: FC<IViewNextProps> = ({ elementId, offset }): JSX.Element => (
	<div className="viewnext">
		<ExpandMoreIcon
			onClick={() => scrollToElementId(elementId, offset)}
			className="viewnext-icon"
		/>
	</div>
);

export default ViewNext;
