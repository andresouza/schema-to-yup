// See:
// http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4

const { YupMixed } = require("./mixed");

class ArrayHandler {
  constructor(config) {
    this.config = config;
  }

  isArray(obj) {
    return this.config.isArray(obj);
  }

  handle(obj) {
    return this.isArray(obj) && YupArray.create(obj).yupped();
  }
}

function toYupArray(obj, config = {}) {
  return obj && new ArrayHandler(config).handle(obj);
}

class YupArray extends YupMixed {
  constructor(obj) {
    super(obj);
    this.type = "array";
    this.base = this.yup.array();
    this.createYupSchemaEntry = this.config.createYupSchemaEntry;
  }

  static create(obj) {
    return new YupArray(obj);
  }

  convert() {
    this.maxItems();
    this.minItems();
    this.ensureItems();
    this.compact();
    // this.$uniqueItems()
    //   .$contains()
    //   .$additionalItems()
    //   .$items();

    // this.itemsOf()

    super.convert();
    return this;
  }

  ensureItems() {
    return this.addConstraint("ensure");
  }

  compact() {
    return this.addConstraint("compact");
  }

  // TODO: not yet implemented
  itemsOf() {
    return this;
    // const { items, itemsOf } = this.constraints;
    // const $itemsOfSchema = items || itemsOf || this.constraints.of;

    // if (Array.isArray($itemsOfSchema)) {
    //   this.error("itemsOf", "does not (yet) support an Array of schemas");
    // }

    // if (!this.createYupSchemaEntry) {
    //   this.warn(
    //     "missing createYupSchemaEntry in config, needed for recursive validation"
    //   );
    //   return;
    // }
    // this.createYupSchemaEntry({
    //   key: this.key,
    //   value: $itemsOfSchema,
    //   type: this.type,
    //   config: this.config
    // });
    // $of && this.base.of($max);
    // return this;
  }

  maxItems() {
    const { maxItems, max } = this.constraints;
    const $max = maxItems || max;
    if (!this.isValidSize($max)) {
      return this.handleInvalidSize("maxItems", $max);
    }
    const newBase = $max && this.base.max($max);
    this.base = newBase || this.base;
    return this;
  }

  handleInvalidSize(name, value) {
    const msg = `invalid array size constraint for ${name}, was ${value}. Must be a number >= 0`;
    if (this.config.warnOnInvalid) {
      this.warn(msg);
      return this;
    }
    this.errorMsg(msg);
  }

  isValidSize(num) {
    return !isNaN(num) && num >= 0;
  }

  minItems() {
    const { minItems, min } = this.constraints;
    const $min = minItems || min;
    if (!this.isValidSize($min)) {
      return this.handleInvalidSize("minItems", $min);
    }
    const newBase = $min && this.base.min($min);
    this.base = newBase || this.base;
    return this;
  }

  $items() {
    return this;
  }

  $additionalItems() {
    return this;
  }

  $uniqueItems() {
    return this;
  }

  $contains() {
    return this;
  }
}

module.exports = {
  toYupArray,
  YupArray,
  ArrayHandler
};
