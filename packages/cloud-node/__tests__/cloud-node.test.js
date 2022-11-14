const axios = require('axios');
const CloudClient = require('../lib/index');

describe('NodeCloudClient', () => {
    let cloudClient;
    let mockService;
    beforeEach(() => {
        mockService = jest.fn().mockResolvedValue({});
        jest.spyOn(axios, 'create').mockReturnValue({
            request: mockService
        });
        cloudClient = new CloudClient();
    })
    test("when type is ignored then set json header", done => {
        cloudClient.request(
            'the_url',
            {key: 'value'},
            {})
            .then(res => {
                expect(mockService.mock.calls[0][0]).toStrictEqual({
                    url: 'the_url',
                    data: {key: 'value'},
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                });
                done();
            });
    })

    test("when type is json then set json header", done => {
        cloudClient.request(
            'the_url',
            {key: 'value'},
            {},
            'json')
            .then(res => {
                expect(mockService.mock.calls[0][0]).toStrictEqual({
                    url: 'the_url',
                    data: {key: 'value'},
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                });
                done();
            });
    })

    test("when type is urlencoded then set urlencoded header", done => {
        cloudClient.request(
            'the_url',
            {key: 'value'},
            {},
            'urlencoded')
            .then(res => {
                expect(mockService.mock.calls[0][0]).toStrictEqual({
                    url: 'the_url',
                    params: {key: 'value'},
                    data: "key=value",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                });
                done();
            });
    })

    test("when config is set then merge config", done => {
        cloudClient.request(
            'the_url',
            {key: 'value'},
            {headers: {name: 'value'}, token: 'token_value'},
            'urlencoded')
            .then(res => {
                expect(mockService.mock.calls[0][0]).toStrictEqual({
                    url: 'the_url',
                    params: {key: 'value'},
                    data: "key=value",
                    headers: {name: 'value'},
                    token: 'token_value'
                });
                done();
            });
    })
});