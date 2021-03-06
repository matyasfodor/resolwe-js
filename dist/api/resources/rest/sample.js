"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var rest_resource_1 = require("./rest_resource");
var error_1 = require("../../../core/errors/error");
var permissions_1 = require("../addons/permissions");
/**
 * Sample resource class for dealing with sample endpoint.
 */
var SampleResource = /** @class */ (function (_super) {
    __extends(SampleResource, _super);
    function SampleResource(connection) {
        return _super.call(this, 'sample', connection) || this;
    }
    /**
     * Checks if sample slug already exists.
     *
     * @param Slug to check
     * @return An observable that emits the response
     */
    SampleResource.prototype.slugExists = function (slug) {
        return this.connection.get(this.getListMethodPath('slug_exists'), { name: slug });
    };
    /**
     * This method should not be used.
     */
    SampleResource.prototype.query = function (query, options) {
        if (query['workaroundForQueryOne']) {
            return _super.prototype.query.call(this, _.omit(query, 'workaroundForQueryOne'), options);
        }
        throw new error_1.GenError("Query method not supported");
    };
    SampleResource.prototype.queryOne = function (query, options) {
        if (query === void 0) { query = {}; }
        return _super.prototype.queryOne.call(this, __assign({}, query, { workaroundForQueryOne: true }), options);
    };
    SampleResource.prototype.queryUnannotated = function (query, options) {
        if (query === void 0) { query = {}; }
        return _super.prototype.query.call(this, __assign({}, query, { descriptor_completed: false }), options);
    };
    SampleResource.prototype.queryAnnotated = function (query, options) {
        if (query === void 0) { query = {}; }
        return _super.prototype.query.call(this, __assign({}, query, { descriptor_completed: true }), options);
    };
    /**
     * Adds sample to collections.
     *
     * @param sampleId Sample id
     * @param collectionIds Array of collection ids
     * @returns {Rx.Observable<void>}
     */
    SampleResource.prototype.addToCollections = function (sampleId, collectionIds) {
        return this.callMethod(sampleId, 'add_to_collection', { ids: collectionIds });
    };
    SampleResource.prototype.create = function (data) {
        throw new error_1.GenError("Create method not supported");
    };
    SampleResource.prototype.replace = function (primaryKey, data) {
        throw new error_1.GenError("Replace method not supported");
    };
    SampleResource.prototype.delete = function (primaryKey, deleteContent) {
        if (deleteContent === void 0) { deleteContent = false; }
        return _super.prototype.delete.call(this, primaryKey, {}, { delete_content: deleteContent });
    };
    SampleResource.prototype.getPermissions = function (id) {
        return permissions_1.getPermissions(this, id);
    };
    SampleResource.prototype.setPermissions = function (id, permissions) {
        return permissions_1.setPermissions(this, id, permissions);
    };
    return SampleResource;
}(rest_resource_1.RESTResource));
exports.SampleResource = SampleResource;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcGkvcmVzb3VyY2VzL3Jlc3Qvc2FtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMEJBQTRCO0FBQzVCLGlEQUE2QztBQUc3QyxvREFBb0Q7QUFDcEQscURBQXFGO0FBR3JGOztHQUVHO0FBQ0g7SUFBb0Msa0NBQTRDO0lBRTVFLHdCQUFZLFVBQXNCO2VBQzlCLGtCQUFNLFFBQVEsRUFBRSxVQUFVLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksbUNBQVUsR0FBakIsVUFBa0IsSUFBWTtRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQVUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVEOztPQUVHO0lBQ0ksOEJBQUssR0FBWixVQUFhLEtBQWtCLEVBQUUsT0FBc0I7UUFDbkQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxpQkFBTSxLQUFLLFlBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4RSxDQUFDO1FBQ0QsTUFBTSxJQUFJLGdCQUFRLENBQUMsNEJBQTRCLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBTU0saUNBQVEsR0FBZixVQUFnQixLQUF1QixFQUFFLE9BQXNCO1FBQS9DLHNCQUFBLEVBQUEsVUFBdUI7UUFDbkMsTUFBTSxDQUFDLGlCQUFNLFFBQVEseUJBQUssS0FBSyxJQUFFLHFCQUFxQixFQUFFLElBQUksS0FBRyxPQUFPLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBTU0seUNBQWdCLEdBQXZCLFVBQXdCLEtBQXVCLEVBQUUsT0FBc0I7UUFBL0Msc0JBQUEsRUFBQSxVQUF1QjtRQUMzQyxNQUFNLENBQUMsaUJBQU0sS0FBSyx5QkFBSyxLQUFLLElBQUUsb0JBQW9CLEVBQUUsS0FBSyxLQUFHLE9BQU8sQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFNTSx1Q0FBYyxHQUFyQixVQUFzQixLQUF1QixFQUFFLE9BQXNCO1FBQS9DLHNCQUFBLEVBQUEsVUFBdUI7UUFDekMsTUFBTSxDQUFDLGlCQUFNLEtBQUsseUJBQUssS0FBSyxJQUFFLG9CQUFvQixFQUFFLElBQUksS0FBRyxPQUFPLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0kseUNBQWdCLEdBQXZCLFVBQXdCLFFBQWdCLEVBQUUsYUFBdUI7UUFDN0QsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQU8sUUFBUSxFQUFFLG1CQUFtQixFQUFFLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUVNLCtCQUFNLEdBQWIsVUFBYyxJQUFZO1FBQ3RCLE1BQU0sSUFBSSxnQkFBUSxDQUFDLDZCQUE2QixDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVNLGdDQUFPLEdBQWQsVUFBZSxVQUEyQixFQUFFLElBQVk7UUFDcEQsTUFBTSxJQUFJLGdCQUFRLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRU0sK0JBQU0sR0FBYixVQUFjLFVBQTJCLEVBQUUsYUFBOEI7UUFBOUIsOEJBQUEsRUFBQSxxQkFBOEI7UUFDckUsTUFBTSxDQUFDLGlCQUFNLE1BQU0sWUFBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVNLHVDQUFjLEdBQXJCLFVBQXNCLEVBQVU7UUFDNUIsTUFBTSxDQUFDLDRCQUFjLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFTSx1Q0FBYyxHQUFyQixVQUFzQixFQUFVLEVBQUUsV0FBd0M7UUFDdEUsTUFBTSxDQUFDLDRCQUFjLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBQ0wscUJBQUM7QUFBRCxDQWhGQSxBQWdGQyxDQWhGbUMsNEJBQVksR0FnRi9DO0FBaEZZLHdDQUFjIiwiZmlsZSI6ImFwaS9yZXNvdXJjZXMvcmVzdC9zYW1wbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSeCBmcm9tICdyeCc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1JFU1RSZXNvdXJjZX0gZnJvbSAnLi9yZXN0X3Jlc291cmNlJztcbmltcG9ydCB7UXVlcnlPcHRpb25zfSBmcm9tICcuLi8uLi9yZXNvdXJjZSc7XG5pbXBvcnQge0Nvbm5lY3Rpb259IGZyb20gJy4uLy4uL2Nvbm5lY3Rpb24nO1xuaW1wb3J0IHtHZW5FcnJvcn0gZnJvbSAnLi4vLi4vLi4vY29yZS9lcnJvcnMvZXJyb3InO1xuaW1wb3J0IHtQZXJtaXNzaW9uYWJsZSwgZ2V0UGVybWlzc2lvbnMsIHNldFBlcm1pc3Npb25zfSBmcm9tICcuLi9hZGRvbnMvcGVybWlzc2lvbnMnO1xuaW1wb3J0ICogYXMgdHlwZXMgZnJvbSAnLi4vLi4vdHlwZXMvcmVzdCc7XG5cbi8qKlxuICogU2FtcGxlIHJlc291cmNlIGNsYXNzIGZvciBkZWFsaW5nIHdpdGggc2FtcGxlIGVuZHBvaW50LlxuICovXG5leHBvcnQgY2xhc3MgU2FtcGxlUmVzb3VyY2UgZXh0ZW5kcyBSRVNUUmVzb3VyY2U8dHlwZXMuU2FtcGxlIHwgdHlwZXMuUHJlc2FtcGxlPiBpbXBsZW1lbnRzIFBlcm1pc3Npb25hYmxlIHtcblxuICAgIGNvbnN0cnVjdG9yKGNvbm5lY3Rpb246IENvbm5lY3Rpb24pIHtcbiAgICAgICAgc3VwZXIoJ3NhbXBsZScsIGNvbm5lY3Rpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBzYW1wbGUgc2x1ZyBhbHJlYWR5IGV4aXN0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBTbHVnIHRvIGNoZWNrXG4gICAgICogQHJldHVybiBBbiBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIHJlc3BvbnNlXG4gICAgICovXG4gICAgcHVibGljIHNsdWdFeGlzdHMoc2x1Zzogc3RyaW5nKTogUnguT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uZ2V0PGJvb2xlYW4+KHRoaXMuZ2V0TGlzdE1ldGhvZFBhdGgoJ3NsdWdfZXhpc3RzJyksIHsgbmFtZTogc2x1ZyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4gICAgICovXG4gICAgcHVibGljIHF1ZXJ5KHF1ZXJ5OiB0eXBlcy5RdWVyeSwgb3B0aW9ucz86IFF1ZXJ5T3B0aW9ucyk6IFJ4Lk9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIGlmIChxdWVyeVsnd29ya2Fyb3VuZEZvclF1ZXJ5T25lJ10pIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5xdWVyeShfLm9taXQocXVlcnksICd3b3JrYXJvdW5kRm9yUXVlcnlPbmUnKSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEdlbkVycm9yKFwiUXVlcnkgbWV0aG9kIG5vdCBzdXBwb3J0ZWRcIik7XG4gICAgfVxuXG4gICAgcHVibGljIHF1ZXJ5T25lKHF1ZXJ5PzogdHlwZXMuUXVlcnlPYmplY3QsIG9wdGlvbnM/OiBRdWVyeU9wdGlvbnMpOlxuICAgICAgICBSeC5PYnNlcnZhYmxlPHR5cGVzLlNhbXBsZSB8IHR5cGVzLlByZXNhbXBsZT47XG4gICAgcHVibGljIHF1ZXJ5T25lKHF1ZXJ5OiB0eXBlcy5RdWVyeU9iamVjdEh5ZHJhdGVEYXRhLCBvcHRpb25zPzogUXVlcnlPcHRpb25zKTpcbiAgICAgICAgUnguT2JzZXJ2YWJsZTx0eXBlcy5TYW1wbGVIeWRyYXRlRGF0YSB8IHR5cGVzLlByZXNhbXBsZUh5ZHJhdGVEYXRhPjtcbiAgICBwdWJsaWMgcXVlcnlPbmUocXVlcnk6IHR5cGVzLlF1ZXJ5ID0ge30sIG9wdGlvbnM/OiBRdWVyeU9wdGlvbnMpOiBSeC5PYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gc3VwZXIucXVlcnlPbmUoey4uLnF1ZXJ5LCB3b3JrYXJvdW5kRm9yUXVlcnlPbmU6IHRydWV9LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcXVlcnlVbmFubm90YXRlZChxdWVyeT86IHR5cGVzLlF1ZXJ5T2JqZWN0LCBvcHRpb25zPzogUXVlcnlPcHRpb25zKTpcbiAgICAgICAgUnguT2JzZXJ2YWJsZTx0eXBlcy5QcmVzYW1wbGVbXT47XG4gICAgcHVibGljIHF1ZXJ5VW5hbm5vdGF0ZWQocXVlcnk6IHR5cGVzLlF1ZXJ5T2JqZWN0SHlkcmF0ZURhdGEsIG9wdGlvbnM/OiBRdWVyeU9wdGlvbnMpOlxuICAgICAgICBSeC5PYnNlcnZhYmxlPHR5cGVzLlByZXNhbXBsZUh5ZHJhdGVEYXRhW10+O1xuICAgIHB1YmxpYyBxdWVyeVVuYW5ub3RhdGVkKHF1ZXJ5OiB0eXBlcy5RdWVyeSA9IHt9LCBvcHRpb25zPzogUXVlcnlPcHRpb25zKTogUnguT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnF1ZXJ5KHsuLi5xdWVyeSwgZGVzY3JpcHRvcl9jb21wbGV0ZWQ6IGZhbHNlfSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHVibGljIHF1ZXJ5QW5ub3RhdGVkKHF1ZXJ5PzogdHlwZXMuUXVlcnlPYmplY3QsIG9wdGlvbnM/OiBRdWVyeU9wdGlvbnMpOlxuICAgICAgICBSeC5PYnNlcnZhYmxlPHR5cGVzLlNhbXBsZVtdPjtcbiAgICBwdWJsaWMgcXVlcnlBbm5vdGF0ZWQocXVlcnk6IHR5cGVzLlF1ZXJ5T2JqZWN0SHlkcmF0ZURhdGEsIG9wdGlvbnM/OiBRdWVyeU9wdGlvbnMpOlxuICAgICAgICBSeC5PYnNlcnZhYmxlPHR5cGVzLlNhbXBsZUh5ZHJhdGVEYXRhW10+O1xuICAgIHB1YmxpYyBxdWVyeUFubm90YXRlZChxdWVyeTogdHlwZXMuUXVlcnkgPSB7fSwgb3B0aW9ucz86IFF1ZXJ5T3B0aW9ucyk6IFJ4Lk9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiBzdXBlci5xdWVyeSh7Li4ucXVlcnksIGRlc2NyaXB0b3JfY29tcGxldGVkOiB0cnVlfSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBzYW1wbGUgdG8gY29sbGVjdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2FtcGxlSWQgU2FtcGxlIGlkXG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb25JZHMgQXJyYXkgb2YgY29sbGVjdGlvbiBpZHNcbiAgICAgKiBAcmV0dXJucyB7UnguT2JzZXJ2YWJsZTx2b2lkPn1cbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkVG9Db2xsZWN0aW9ucyhzYW1wbGVJZDogbnVtYmVyLCBjb2xsZWN0aW9uSWRzOiBudW1iZXJbXSk6IFJ4Lk9ic2VydmFibGU8dm9pZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsTWV0aG9kPHZvaWQ+KHNhbXBsZUlkLCAnYWRkX3RvX2NvbGxlY3Rpb24nLCB7IGlkczogY29sbGVjdGlvbklkcyB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY3JlYXRlKGRhdGE6IE9iamVjdCk6IFJ4Lk9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHRocm93IG5ldyBHZW5FcnJvcihcIkNyZWF0ZSBtZXRob2Qgbm90IHN1cHBvcnRlZFwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVwbGFjZShwcmltYXJ5S2V5OiBudW1iZXIgfCBzdHJpbmcsIGRhdGE6IE9iamVjdCk6IFJ4Lk9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHRocm93IG5ldyBHZW5FcnJvcihcIlJlcGxhY2UgbWV0aG9kIG5vdCBzdXBwb3J0ZWRcIik7XG4gICAgfVxuXG4gICAgcHVibGljIGRlbGV0ZShwcmltYXJ5S2V5OiBudW1iZXIgfCBzdHJpbmcsIGRlbGV0ZUNvbnRlbnQ6IGJvb2xlYW4gPSBmYWxzZSk6IFJ4Lk9ic2VydmFibGU8T2JqZWN0PiB7XG4gICAgICAgIHJldHVybiBzdXBlci5kZWxldGUocHJpbWFyeUtleSwge30sIHsgZGVsZXRlX2NvbnRlbnQ6IGRlbGV0ZUNvbnRlbnQgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFBlcm1pc3Npb25zKGlkOiBudW1iZXIpOiBSeC5PYnNlcnZhYmxlPHR5cGVzLkl0ZW1QZXJtaXNzaW9uc1tdPiB7XG4gICAgICAgIHJldHVybiBnZXRQZXJtaXNzaW9ucyh0aGlzLCBpZCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFBlcm1pc3Npb25zKGlkOiBudW1iZXIsIHBlcm1pc3Npb25zOiB0eXBlcy5TZXRQZXJtaXNzaW9uc1JlcXVlc3QpOiBSeC5PYnNlcnZhYmxlPHR5cGVzLkl0ZW1QZXJtaXNzaW9uc1tdPiB7XG4gICAgICAgIHJldHVybiBzZXRQZXJtaXNzaW9ucyh0aGlzLCBpZCwgcGVybWlzc2lvbnMpO1xuICAgIH1cbn1cbiJdfQ==
