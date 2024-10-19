import { EntityType } from '../entity-type.enum';
import { Status } from '../../enums/status.enum';

export class GetUserEntityDetailsDto {
  entityType: EntityType;
  status: Status;
}
