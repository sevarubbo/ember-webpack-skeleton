/**
 *
 */

export default Em.Component.extend({

    classNameBindings: ["b"],


    /**
     * Attributes
     */

    /**
     * @property {String}
     * @readonly
     */
    name: null,



    /**
     * Properties
     */

    /**
     * @property {String}
     * @readonly
     */
    b: function () {
        return `b-${this.get("name")}`;
    }.property("name")

});
