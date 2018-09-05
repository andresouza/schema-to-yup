const {
  YupMixed
} = require('./mixed')

// TODO: check if has any date format
function hasDateContraint(obj) {
  return false
}

function hasDateType(type) {
  return ['date', 'date-time'].find(t => t === type)
}

function isDate(obj) {
  return (obj.type === 'string' && hasDateContraint(obj)) || hasDateType(obj.type)
}

function toYupDate(obj) {
  return isDate(obj) && YupDate.create(obj).yupped()
}

class YupDate extends YupBaseType {
  constructor(obj) {
    super(obj)
    this.type = 'date'
    this.base = this.yup[this.type]()
  }

  static create(obj) {
    return new YupDate(obj)
  }

  convert() {
    this.min().max()
    super.convert()
    return this
  }

  toDate(date) {
    return new Date(date)
  }

  min() {
    const minDate = this.value.min || this.value.minDate
    minDate && this.base.min(this.toDate(minDate), this.errMessage['minDate'] || this.errMessage['min'])
    return this
  }

  max() {
    const maxDate = this.value.max || this.value.maxDate
    maxDate && this.base.max(this.toDate(maxDate), this.errMessage['maxDate'] || this.errMessage['max'])
    return this
  }
}

module.exports = {
  toYupDate,
  YupDate
}
