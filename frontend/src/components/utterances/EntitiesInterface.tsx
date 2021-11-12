import { FC } from "react";

import { IEntity } from "../../types/interfaces";
import InputField from "../InputField";

import "../../scss/components/utterances/EntitiesInterface.scss";

interface IEntitiesInterfaceProps {
	entities: IEntity[];
	setEntities: (entities: IEntity[]) => void;
}

const EntitiesInterface: FC<IEntitiesInterfaceProps> = ({
	entities,
	setEntities,
}): JSX.Element => {
	/**
	 * Takes in new entity value, and index of where the entity is located to update entity
	 * @param value Value of updated entity value
	 * @param index Index of where entity is located in array
	 */
	const setEntity = (value: string, index: number): void => {
		const tempEntities = entities; // Copy over current entities
		tempEntities[index].value = value; // Update entity with new value
		setEntities(tempEntities); // Set new entities
	};

	return (
		<div className="entitiesInterface">
			{entities.map((entity: IEntity, key: number) => (
				<InputField
					key={key}
					index={key}
					variable={entity.entity}
					value={entity.value}
					setValue={setEntity}
				/>
			))}
		</div>
	);
};

export default EntitiesInterface;
