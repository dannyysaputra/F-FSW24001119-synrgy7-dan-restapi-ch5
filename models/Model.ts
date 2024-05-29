import { Model } from 'objection';

class BaseModel extends Model {
    created_at!: Date;
    updated_at!: Date;
}

export default BaseModel;