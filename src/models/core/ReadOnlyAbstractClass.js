import {AbstractModel} from "./AbstractModel"

export class ReadOnlyAbstractClass extends AbstractModel{

  constructor(attributes, config) {
    super(attributes, config);

    if (new.target === ReadOnlyAbstractClass) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  async save() {
    throw new TypeError("Not allowed method");
  }

  async create() {
    throw new TypeError("Not allowed method");
  }

  async update() {
    throw new TypeError("Not allowed method");
  }

  async delete() {
    throw new TypeError("Not allowed method");
  }

}
