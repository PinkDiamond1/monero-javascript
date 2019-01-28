const assert = require("assert");
const MoneroUtils = require("../../utils/MoneroUtils");
const MoneroTransfer = require("./MoneroTransfer");
const MoneroDestination = require("./MoneroDestination");

/**
 * Common configuration for sending and sweeping.
 */
class MoneroSendConfig {
  
  /**
   * Construct the configuration.
   * 
   * @param {object|string} configOrAddress is existing configuration or a destination address (optional)
   * @param {BigInteger} amount is the amount to send (optional)
   * @param {string} paymentId is the payment id (optional)
   * @param {MoneroSendPriority} priority is the transaction priority (optional)
   * @param {int} mixin is the number of outputs from the blockchain to mix with (optional)
   */
  constructor(configOrAddress, amount, paymentId, priority, mixin, fee) {
    if (configOrAddress instanceof Object) {
      this.state = Object.assign({}, configOrAddress);
      assert.equal(arguments.length, 1, "Send configuration must be constructed with either an existing configuration or individual arguments but not both");
      
      // deserialize if necessary
      if (this.state.destinations) {
        this.state.destinations = this.state.destinations.map(destination => destination instanceof MoneroDestination ? destination : new MoneroDestination(destination));
      }
    } else {
      this.state = {};
      if (typeof configOrAddress === "string") this.setDestinations([new MoneroDestination(configOrAddress, amount)]);
      this.setPaymentId(paymentId);
      this.setPriority(priority);
      this.setMixin(mixin);
      this.setFee(fee);
    }
  }
  
  getDestinations() {
    return this.state.destinations;
  }
  
  setDestinations(destinations) {
    this.state.destinations = destinations;
    return this;
  }
  
  getPaymentId() {
    return this.state.paymentId;
  }
  
  setPaymentId(paymentId) {
    this.state.paymentId = paymentId;
    return this;
  }
  
  getPriority() {
    return this.state.priority;
  }
  
  setPriority(priority) {
    this.state.priority = priority;
    return this;
  }
  
  getMixin() {
    return this.state.mixin;
  }
  
  setMixin(mixin) {
    this.state.mixin = mixin;
    return this;
  }
  
  getFee() {
    return this.state.fee;
  }
  
  setFee(fee) {
    this.state.fee = fee;
    return this;
  }
  
  getAccountIndex() {
    return this.state.accountIndex;
  }
  
  setAccountIndex(accountIndex) {
    this.state.accountIndex = accountIndex;
    return this;
  }
  
  getSubaddressIndices() {
    return this.state.subaddressIndices;
  }
  
  setSubaddressIndices(subaddressIndices) {
    this.state.subaddressIndices = subaddressIndices;
    return this;
  }
  
  getUnlockTime() {
    return this.state.unlockTime;
  }
  
  setUnlockTime(unlockTime) {
    this.state.unlockTime = unlockTime;
    return this;
  }
  
  getDoNotRelay() {
    return this.state.doNotRelay;
  }
  
  setDoNotRelay(doNotRelay) {
    this.state.doNotRelay = doNotRelay;
    return this;
  }
  
  getCanSplit() {
    return this.state.canSplit;
  }
  
  setCanSplit(canSplit) {
    this.state.canSplit = canSplit;
    return this;
  }
  
  getNote() {
    return this.state.note;
  }
  
  setNote(note) {
    this.state.note = note;
    return this;
  }
  
  getRecipientName() {
    return this.state.recipientName;
  }
  
  setRecipientName(recipientName) {
    this.state.recipientName = recipientName;
    return this;
  }
  
  // --------------------------- SPECIFIC TO SWEEP ----------------------------
  
  getBelowAmount() {
    return this.state.belowAmount;
  }
  
  setBelowAmount(belowAmount) {
    this.state.belowAmount = belowAmount;
    return this;
  }
  
  getSweepEachSubaddress() {
    return this.state.sweepEachSubaddress;
  }
  
  setSweepEachSubaddress(sweepEachSubaddress) {
    this.state.sweepEachSubaddress = sweepEachSubaddress;
    return this;
  }
  
  getKeyImage() {
    return this.state.keyImage;
  }
  
  setKeyImage(keyImage) {
    this.state.keyImage = keyImage;
    return this;
  }
}

module.exports = MoneroSendConfig