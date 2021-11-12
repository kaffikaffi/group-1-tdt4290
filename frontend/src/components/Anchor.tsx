import { FC } from "react";

interface IAnchorProps {
	id: string;
	style?: React.CSSProperties | undefined;
}

const Anchor: FC<IAnchorProps> = ({ id, style }): JSX.Element => (
	<div id={id} style={style} />
);

Anchor.defaultProps = {
	style: undefined,
};

export default Anchor;
