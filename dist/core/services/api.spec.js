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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Rx = require("rx");
var mock_1 = require("../../api/mock");
var base_1 = require("../components/base");
var component_1 = require("../../tests/component");
describe('mock api', function () {
    it('mocks basic non-reactive queries', function () {
        var mockApi = new mock_1.MockApi();
        var subscriber = jasmine.createSpy('subscriber');
        mockApi.createResource('collection');
        // Queries are not reactive by default.
        mockApi.Collection.query().subscribe(subscriber);
        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber.calls.mostRecent().args[0]).toEqual([]);
        // Add an item.
        mockApi.addItem('collection', { id: 1, name: 'Hello world' });
        expect(subscriber).toHaveBeenCalledTimes(1);
        // Since it is a non-reactive query, we need to repeat the query.
        mockApi.Collection.query().subscribe(subscriber);
        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(subscriber.calls.mostRecent().args[0]).toEqual([{ id: 1, name: 'Hello world' }]);
    });
    it('mocks basic reactive queries', function () {
        var mockApi = new mock_1.MockApi();
        var subscriber = jasmine.createSpy('subscriber');
        mockApi.createResource('collection');
        mockApi.Collection.query({}, { reactive: true }).subscribe(subscriber);
        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber.calls.mostRecent().args[0]).toEqual([]);
        // Add an item.
        mockApi.addItem('collection', { id: 1, name: 'Hello world' });
        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(subscriber.calls.mostRecent().args[0]).toEqual([{ id: 1, name: 'Hello world' }]);
        // Update an item.
        mockApi.updateItem('collection', { id: 1, name: 'Hello mockups' });
        expect(subscriber).toHaveBeenCalledTimes(3);
        expect(subscriber.calls.mostRecent().args[0]).toEqual([{ id: 1, name: 'Hello mockups' }]);
        // Remove an item.
        mockApi.removeItem('collection', 1);
        expect(subscriber).toHaveBeenCalledTimes(4);
        expect(subscriber.calls.mostRecent().args[0]).toEqual([]);
    });
    it('mocks complex reactive queries', function () {
        var mockApi = new mock_1.MockApi();
        var subscriberPlain = jasmine.createSpy('subscriberPlain');
        var subscriberWithFilter = jasmine.createSpy('subscriberWithFilter');
        mockApi.createResource('collection', 'id', function (query, items) {
            if (_.isEmpty(query))
                return items;
            return _.filter(items, function (item) { return item.name === query.name; });
        });
        mockApi.Collection.query({}, { reactive: true }).subscribe(subscriberPlain);
        mockApi.Collection.query({ name: 'Hello' }, { reactive: true }).subscribe(subscriberWithFilter);
        mockApi.addItem('collection', { id: 1, name: 'Collection A' });
        mockApi.addItem('collection', { id: 2, name: 'Another one' });
        mockApi.addItem('collection', { id: 3, name: 'Hello' });
        mockApi.addItem('collection', { id: 4, name: 'Hello world' });
        expect(subscriberPlain).toHaveBeenCalledTimes(5);
        expect(subscriberWithFilter).toHaveBeenCalledTimes(2);
    });
    it('mocks non-query operations', function () {
        var mockApi = new mock_1.MockApi();
        var subscriber = jasmine.createSpy('subscriber');
        mockApi.whenPost('/api/collection', subscriber);
        mockApi.Collection.create({ name: 'Foo' });
        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber.calls.mostRecent().args[0]).toEqual({});
        expect(subscriber.calls.mostRecent().args[1]).toEqual({ name: 'Foo' });
        mockApi.whenPost(/^\/api\/collection\/(.+?)\/add_data/, subscriber);
        mockApi.Collection.addData(1, [1, 2, 3, 4]);
        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(subscriber.calls.mostRecent().args[1]).toEqual({ ids: [1, 2, 3, 4] });
        expect(subscriber.calls.mostRecent().args[2][1]).toEqual('1');
        mockApi.whenGet('/api/collection/slug_exists', function (parameters, data) {
            return parameters.name === 'hello';
        });
        mockApi.Collection.slugExists('bar').subscribe(subscriber);
        expect(subscriber).toHaveBeenCalledTimes(3);
        expect(subscriber.calls.mostRecent().args[0]).toBe(false);
        mockApi.Collection.slugExists('hello').subscribe(subscriber);
        expect(subscriber).toHaveBeenCalledTimes(4);
        expect(subscriber.calls.mostRecent().args[0]).toBe(true);
    });
    it('supports zip operation', function () {
        var mockApi = new mock_1.MockApi();
        var subscriber = jasmine.createSpy('subscriber');
        mockApi.createResource('collection');
        mockApi.addItem('collection', { id: 1 });
        Rx.Observable.zip(mockApi.Collection.query(), mockApi.Collection.query()).subscribe(subscriber);
        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber.calls.mostRecent().args[0]).toEqual([[{ id: 1 }], [{ id: 1 }]]);
    });
});
component_1.describeComponent('angular mock api', [], function (tester) {
    var TestComponent = /** @class */ (function (_super) {
        __extends(TestComponent, _super);
        // @ngInject
        TestComponent.$inject = ["$scope", "api"];
        function TestComponent($scope, api) {
            var _this = _super.call(this, $scope) || this;
            _this.subscribe('collection', api.Collection.queryOne());
            return _this;
        }
        TestComponent = __decorate([
            base_1.component({
                module: tester.module,
                directive: 'gen-test-component',
                template: "<div class=\"text-name\">Collection name is {{ctrl.collection.name}}</div>",
            })
        ], TestComponent);
        return TestComponent;
    }(base_1.ComponentBase));
    it('replaces api service', function () {
        tester.api().createResource('collection');
        tester.api().addItem('collection', { id: 1, name: 'Hello world' });
        var component = tester.createComponent(TestComponent.asView().template);
        expect(component.ctrl.collection.id).toBe(1);
        expect(component.ctrl.collection.name).toBe('Hello world');
        expect(component.element.find('.text-name').text()).toBe('Collection name is Hello world');
    });
    it('mocks uploads', function (done) {
        var uploaded = false;
        tester.api().whenUpload(function (data, fileUID) {
            uploaded = true;
            return { data: 'hello' };
        });
        tester.api().upload({}, 'test-uuid').then(function (response) {
            expect(uploaded).toEqual(true);
            expect(response.data).toEqual('hello');
            done();
        });
    });
});
describe('resource', function () {
    it('correctly caches reactive queries', function (done) {
        var called = 0;
        var mockApi = new mock_1.MockApi();
        var subscriber = function () {
            if (++called === 3) {
                done();
            }
        };
        mockApi.createResource('process');
        mockApi.simulateDelay(true);
        mockApi.Process.query({}, { reactive: true }).take(1).subscribe(subscriber);
        mockApi.Process.query({}, { reactive: true }).take(1).subscribe(subscriber);
        mockApi.Process.query({}, { reactive: true }).take(1).subscribe(subscriber);
        // Ensure these queries have been delayed.
        expect(called).toEqual(0);
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlL3NlcnZpY2VzL2FwaS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBCQUE0QjtBQUM1Qix1QkFBeUI7QUFLekIsdUNBQXVDO0FBQ3ZDLDJDQUE0RDtBQUM1RCxtREFBd0Q7QUFLeEQsUUFBUSxDQUFDLFVBQVUsRUFBRTtJQUNqQixFQUFFLENBQUMsa0NBQWtDLEVBQUU7UUFDbkMsSUFBTSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM5QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRW5ELE9BQU8sQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFckMsdUNBQXVDO1FBQ3ZDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFMUQsZUFBZTtRQUNmLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQztRQUM1RCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFNUMsaUVBQWlFO1FBQ2pFLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1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QyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUUxRSwwQ0FBMEM7UUFDMUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImNvcmUvc2VydmljZXMvYXBpLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyBSeCBmcm9tICdyeCc7XG5pbXBvcnQgKiBhcyBhbmd1bGFyIGZyb20gJ2FuZ3VsYXInO1xuXG5pbXBvcnQge0FQSVNlcnZpY2VCYXNlfSBmcm9tICcuL2FwaSc7XG5pbXBvcnQge1Jlc29sd2VBcGl9IGZyb20gJy4uLy4uL2FwaS9pbmRleCc7XG5pbXBvcnQge01vY2tBcGl9IGZyb20gJy4uLy4uL2FwaS9tb2NrJztcbmltcG9ydCB7Y29tcG9uZW50LCBDb21wb25lbnRCYXNlfSBmcm9tICcuLi9jb21wb25lbnRzL2Jhc2UnO1xuaW1wb3J0IHtkZXNjcmliZUNvbXBvbmVudH0gZnJvbSAnLi4vLi4vdGVzdHMvY29tcG9uZW50JztcblxuZXhwb3J0IGludGVyZmFjZSBBUElTZXJ2aWNlIGV4dGVuZHMgQVBJU2VydmljZUJhc2UsIFJlc29sd2VBcGkge1xufVxuXG5kZXNjcmliZSgnbW9jayBhcGknLCAoKSA9PiB7XG4gICAgaXQoJ21vY2tzIGJhc2ljIG5vbi1yZWFjdGl2ZSBxdWVyaWVzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2NrQXBpID0gbmV3IE1vY2tBcGkoKTtcbiAgICAgICAgY29uc3Qgc3Vic2NyaWJlciA9IGphc21pbmUuY3JlYXRlU3B5KCdzdWJzY3JpYmVyJyk7XG5cbiAgICAgICAgbW9ja0FwaS5jcmVhdGVSZXNvdXJjZSgnY29sbGVjdGlvbicpO1xuXG4gICAgICAgIC8vIFF1ZXJpZXMgYXJlIG5vdCByZWFjdGl2ZSBieSBkZWZhdWx0LlxuICAgICAgICBtb2NrQXBpLkNvbGxlY3Rpb24ucXVlcnkoKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSk7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdKS50b0VxdWFsKFtdKTtcblxuICAgICAgICAvLyBBZGQgYW4gaXRlbS5cbiAgICAgICAgbW9ja0FwaS5hZGRJdGVtKCdjb2xsZWN0aW9uJywge2lkOiAxLCBuYW1lOiAnSGVsbG8gd29ybGQnfSk7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSk7XG5cbiAgICAgICAgLy8gU2luY2UgaXQgaXMgYSBub24tcmVhY3RpdmUgcXVlcnksIHdlIG5lZWQgdG8gcmVwZWF0IHRoZSBxdWVyeS5cbiAgICAgICAgbW9ja0FwaS5Db2xsZWN0aW9uLnF1ZXJ5KCkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICBleHBlY3Qoc3Vic2NyaWJlcikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpO1xuICAgICAgICBleHBlY3Qoc3Vic2NyaWJlci5jYWxscy5tb3N0UmVjZW50KCkuYXJnc1swXSkudG9FcXVhbChbe2lkOiAxLCBuYW1lOiAnSGVsbG8gd29ybGQnfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ21vY2tzIGJhc2ljIHJlYWN0aXZlIHF1ZXJpZXMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vY2tBcGkgPSBuZXcgTW9ja0FwaSgpO1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVyID0gamFzbWluZS5jcmVhdGVTcHkoJ3N1YnNjcmliZXInKTtcblxuICAgICAgICBtb2NrQXBpLmNyZWF0ZVJlc291cmNlKCdjb2xsZWN0aW9uJyk7XG5cbiAgICAgICAgbW9ja0FwaS5Db2xsZWN0aW9uLnF1ZXJ5KHt9LCB7cmVhY3RpdmU6IHRydWV9KS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSk7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdKS50b0VxdWFsKFtdKTtcblxuICAgICAgICAvLyBBZGQgYW4gaXRlbS5cbiAgICAgICAgbW9ja0FwaS5hZGRJdGVtKCdjb2xsZWN0aW9uJywge2lkOiAxLCBuYW1lOiAnSGVsbG8gd29ybGQnfSk7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMik7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdKS50b0VxdWFsKFt7aWQ6IDEsIG5hbWU6ICdIZWxsbyB3b3JsZCd9XSk7XG5cbiAgICAgICAgLy8gVXBkYXRlIGFuIGl0ZW0uXG4gICAgICAgIG1vY2tBcGkudXBkYXRlSXRlbSgnY29sbGVjdGlvbicsIHtpZDogMSwgbmFtZTogJ0hlbGxvIG1vY2t1cHMnfSk7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMyk7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdKS50b0VxdWFsKFt7aWQ6IDEsIG5hbWU6ICdIZWxsbyBtb2NrdXBzJ31dKTtcblxuICAgICAgICAvLyBSZW1vdmUgYW4gaXRlbS5cbiAgICAgICAgbW9ja0FwaS5yZW1vdmVJdGVtKCdjb2xsZWN0aW9uJywgMSk7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoNCk7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdKS50b0VxdWFsKFtdKTtcbiAgICB9KTtcblxuICAgIGl0KCdtb2NrcyBjb21wbGV4IHJlYWN0aXZlIHF1ZXJpZXMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vY2tBcGkgPSBuZXcgTW9ja0FwaSgpO1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVyUGxhaW4gPSBqYXNtaW5lLmNyZWF0ZVNweSgnc3Vic2NyaWJlclBsYWluJyk7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZXJXaXRoRmlsdGVyID0gamFzbWluZS5jcmVhdGVTcHkoJ3N1YnNjcmliZXJXaXRoRmlsdGVyJyk7XG5cbiAgICAgICAgbW9ja0FwaS5jcmVhdGVSZXNvdXJjZSgnY29sbGVjdGlvbicsICdpZCcsIChxdWVyeSwgaXRlbXMpID0+IHtcbiAgICAgICAgICAgIGlmIChfLmlzRW1wdHkocXVlcnkpKSByZXR1cm4gaXRlbXM7XG5cbiAgICAgICAgICAgIHJldHVybiBfLmZpbHRlcihpdGVtcywgKGl0ZW06IGFueSkgPT4gaXRlbS5uYW1lID09PSBxdWVyeS5uYW1lKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbW9ja0FwaS5Db2xsZWN0aW9uLnF1ZXJ5KHt9LCB7cmVhY3RpdmU6IHRydWV9KS5zdWJzY3JpYmUoc3Vic2NyaWJlclBsYWluKTtcbiAgICAgICAgbW9ja0FwaS5Db2xsZWN0aW9uLnF1ZXJ5KHtuYW1lOiAnSGVsbG8nfSwge3JlYWN0aXZlOiB0cnVlfSkuc3Vic2NyaWJlKHN1YnNjcmliZXJXaXRoRmlsdGVyKTtcblxuICAgICAgICBtb2NrQXBpLmFkZEl0ZW0oJ2NvbGxlY3Rpb24nLCB7aWQ6IDEsIG5hbWU6ICdDb2xsZWN0aW9uIEEnfSk7XG4gICAgICAgIG1vY2tBcGkuYWRkSXRlbSgnY29sbGVjdGlvbicsIHtpZDogMiwgbmFtZTogJ0Fub3RoZXIgb25lJ30pO1xuICAgICAgICBtb2NrQXBpLmFkZEl0ZW0oJ2NvbGxlY3Rpb24nLCB7aWQ6IDMsIG5hbWU6ICdIZWxsbyd9KTtcbiAgICAgICAgbW9ja0FwaS5hZGRJdGVtKCdjb2xsZWN0aW9uJywge2lkOiA0LCBuYW1lOiAnSGVsbG8gd29ybGQnfSk7XG5cbiAgICAgICAgZXhwZWN0KHN1YnNjcmliZXJQbGFpbikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDUpO1xuICAgICAgICBleHBlY3Qoc3Vic2NyaWJlcldpdGhGaWx0ZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKTtcbiAgICB9KTtcblxuICAgIGl0KCdtb2NrcyBub24tcXVlcnkgb3BlcmF0aW9ucycsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9ja0FwaSA9IG5ldyBNb2NrQXBpKCk7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnc3Vic2NyaWJlcicpO1xuXG4gICAgICAgIG1vY2tBcGkud2hlblBvc3QoJy9hcGkvY29sbGVjdGlvbicsIHN1YnNjcmliZXIpO1xuICAgICAgICBtb2NrQXBpLkNvbGxlY3Rpb24uY3JlYXRlKHtuYW1lOiAnRm9vJ30pO1xuXG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSk7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzBdKS50b0VxdWFsKHt9KTtcbiAgICAgICAgZXhwZWN0KHN1YnNjcmliZXIuY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMV0pLnRvRXF1YWwoe25hbWU6ICdGb28nfSk7XG5cbiAgICAgICAgbW9ja0FwaS53aGVuUG9zdCgvXlxcL2FwaVxcL2NvbGxlY3Rpb25cXC8oLis/KVxcL2FkZF9kYXRhLywgc3Vic2NyaWJlcik7XG4gICAgICAgIG1vY2tBcGkuQ29sbGVjdGlvbi5hZGREYXRhKDEsIFsxLCAyLCAzLCA0XSk7XG5cbiAgICAgICAgZXhwZWN0KHN1YnNjcmliZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKTtcbiAgICAgICAgZXhwZWN0KHN1YnNjcmliZXIuY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMV0pLnRvRXF1YWwoe2lkczogWzEsIDIsIDMsIDRdfSk7XG4gICAgICAgIGV4cGVjdChzdWJzY3JpYmVyLmNhbGxzLm1vc3RSZWNlbnQoKS5hcmdzWzJdWzFdKS50b0VxdWFsKCcxJyk7XG5cbiAgICAgICAgbW9ja0FwaS53aGVuR2V0KCcvYXBpL2NvbGxlY3Rpb24vc2x1Z19leGlzdHMnLCAocGFyYW1ldGVycywgZGF0YSk6IGJvb2xlYW4gPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmFtZXRlcnMubmFtZSA9PT0gJ2hlbGxvJztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbW9ja0FwaS5Db2xsZWN0aW9uLnNsdWdFeGlzdHMoJ2JhcicpLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgZXhwZWN0KHN1YnNjcmliZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygzKTtcbiAgICAgICAgZXhwZWN0KHN1YnNjcmliZXIuY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0pLnRvQmUoZmFsc2UpO1xuXG4gICAgICAgIG1vY2tBcGkuQ29sbGVjdGlvbi5zbHVnRXhpc3RzKCdoZWxsbycpLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgZXhwZWN0KHN1YnNjcmliZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcyg0KTtcbiAgICAgICAgZXhwZWN0KHN1YnNjcmliZXIuY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0pLnRvQmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3VwcG9ydHMgemlwIG9wZXJhdGlvbicsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9ja0FwaSA9IG5ldyBNb2NrQXBpKCk7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnc3Vic2NyaWJlcicpO1xuXG4gICAgICAgIG1vY2tBcGkuY3JlYXRlUmVzb3VyY2UoJ2NvbGxlY3Rpb24nKTtcbiAgICAgICAgbW9ja0FwaS5hZGRJdGVtKCdjb2xsZWN0aW9uJywgeyBpZDogMSB9KTtcblxuICAgICAgICBSeC5PYnNlcnZhYmxlLnppcChtb2NrQXBpLkNvbGxlY3Rpb24ucXVlcnkoKSwgbW9ja0FwaS5Db2xsZWN0aW9uLnF1ZXJ5KCkpLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgZXhwZWN0KHN1YnNjcmliZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKTtcbiAgICAgICAgZXhwZWN0KHN1YnNjcmliZXIuY2FsbHMubW9zdFJlY2VudCgpLmFyZ3NbMF0pLnRvRXF1YWwoWyBbIHsgaWQ6IDEgfSBdLCBbIHsgaWQ6IDEgfSBdIF0pO1xuICAgIH0pO1xufSk7XG5cbmRlc2NyaWJlQ29tcG9uZW50KCdhbmd1bGFyIG1vY2sgYXBpJywgW10sICh0ZXN0ZXIpID0+IHtcbiAgICBAY29tcG9uZW50KHtcbiAgICAgICAgbW9kdWxlOiB0ZXN0ZXIubW9kdWxlLFxuICAgICAgICBkaXJlY3RpdmU6ICdnZW4tdGVzdC1jb21wb25lbnQnLFxuICAgICAgICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJ0ZXh0LW5hbWVcIj5Db2xsZWN0aW9uIG5hbWUgaXMge3tjdHJsLmNvbGxlY3Rpb24ubmFtZX19PC9kaXY+YCxcbiAgICB9KVxuICAgIGNsYXNzIFRlc3RDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnRCYXNlIHtcbiAgICAgICAgcHVibGljIGNvbGxlY3Rpb246IGFueTtcblxuICAgICAgICAvLyBAbmdJbmplY3RcbiAgICAgICAgY29uc3RydWN0b3IoJHNjb3BlOiBhbmd1bGFyLklTY29wZSwgYXBpOiBBUElTZXJ2aWNlKSB7XG4gICAgICAgICAgICBzdXBlcigkc2NvcGUpO1xuXG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZSgnY29sbGVjdGlvbicsIGFwaS5Db2xsZWN0aW9uLnF1ZXJ5T25lKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXQoJ3JlcGxhY2VzIGFwaSBzZXJ2aWNlJywgKCkgPT4ge1xuICAgICAgICB0ZXN0ZXIuYXBpKCkuY3JlYXRlUmVzb3VyY2UoJ2NvbGxlY3Rpb24nKTtcbiAgICAgICAgdGVzdGVyLmFwaSgpLmFkZEl0ZW0oJ2NvbGxlY3Rpb24nLCB7aWQ6IDEsIG5hbWU6ICdIZWxsbyB3b3JsZCd9KTtcblxuICAgICAgICBjb25zdCBjb21wb25lbnQgPSB0ZXN0ZXIuY3JlYXRlQ29tcG9uZW50PFRlc3RDb21wb25lbnQ+KFxuICAgICAgICAgICAgVGVzdENvbXBvbmVudC5hc1ZpZXcoKS50ZW1wbGF0ZVxuICAgICAgICApO1xuXG4gICAgICAgIGV4cGVjdChjb21wb25lbnQuY3RybC5jb2xsZWN0aW9uLmlkKS50b0JlKDEpO1xuICAgICAgICBleHBlY3QoY29tcG9uZW50LmN0cmwuY29sbGVjdGlvbi5uYW1lKS50b0JlKCdIZWxsbyB3b3JsZCcpO1xuICAgICAgICBleHBlY3QoY29tcG9uZW50LmVsZW1lbnQuZmluZCgnLnRleHQtbmFtZScpLnRleHQoKSkudG9CZSgnQ29sbGVjdGlvbiBuYW1lIGlzIEhlbGxvIHdvcmxkJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnbW9ja3MgdXBsb2FkcycsIChkb25lKSA9PiB7XG4gICAgICAgIGxldCB1cGxvYWRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgICAgIHRlc3Rlci5hcGkoKS53aGVuVXBsb2FkKChkYXRhOiBhbnksIGZpbGVVSUQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdXBsb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIDxhbmd1bGFyLklIdHRwUmVzcG9uc2U8c3RyaW5nPj4ge2RhdGE6ICdoZWxsbyd9O1xuICAgICAgICB9KTtcblxuICAgICAgICB0ZXN0ZXIuYXBpKCkudXBsb2FkKHt9LCAndGVzdC11dWlkJykudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGV4cGVjdCh1cGxvYWRlZCkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXNwb25zZS5kYXRhKS50b0VxdWFsKCdoZWxsbycpO1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG5kZXNjcmliZSgncmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgaXQoJ2NvcnJlY3RseSBjYWNoZXMgcmVhY3RpdmUgcXVlcmllcycsIChkb25lKSA9PiB7XG4gICAgICAgIGxldCBjYWxsZWQgPSAwO1xuICAgICAgICBjb25zdCBtb2NrQXBpID0gbmV3IE1vY2tBcGkoKTtcbiAgICAgICAgY29uc3Qgc3Vic2NyaWJlciA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICgrK2NhbGxlZCA9PT0gMykgeyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWNvbnN0YW50LWNvbmRpdGlvblxuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBtb2NrQXBpLmNyZWF0ZVJlc291cmNlKCdwcm9jZXNzJyk7XG4gICAgICAgIG1vY2tBcGkuc2ltdWxhdGVEZWxheSh0cnVlKTtcblxuICAgICAgICBtb2NrQXBpLlByb2Nlc3MucXVlcnkoe30sIHtyZWFjdGl2ZTogdHJ1ZX0pLnRha2UoMSkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICBtb2NrQXBpLlByb2Nlc3MucXVlcnkoe30sIHtyZWFjdGl2ZTogdHJ1ZX0pLnRha2UoMSkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICBtb2NrQXBpLlByb2Nlc3MucXVlcnkoe30sIHtyZWFjdGl2ZTogdHJ1ZX0pLnRha2UoMSkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuXG4gICAgICAgIC8vIEVuc3VyZSB0aGVzZSBxdWVyaWVzIGhhdmUgYmVlbiBkZWxheWVkLlxuICAgICAgICBleHBlY3QoY2FsbGVkKS50b0VxdWFsKDApO1xuICAgIH0pO1xufSk7XG4iXX0=
