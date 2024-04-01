import { StatusCodes } from 'http-status-codes';
import * as supertest from 'supertest';
import server from '../../server';
import { UserHandler } from '../../src/handler';

// ! Implementing tests with Jest
describe('User Model', () => {
    let mockResponse;
    let mockRequest;
    let initServer;

    beforeEach(async () => {
        mockRequest = (body: any) => {
            return {
                body,
            };
        };
        mockResponse = () => {
            const res = { statusCode: 0, status: null, json: null };
            res.status = jest.fn().mockImplementationOnce((status: number) => {
                res.statusCode = status;
                return res;
            });
            res.json = jest.fn().mockImplementationOnce((response) => {
                res.json = response;
                return res;
            });
            return res;
        };

        initServer = supertest(server);
    });

    afterEach(() => {});

    it('Should return an error if any user data is missing in request', async () => {
        await initServer.post(`/api/users`);

        const res = mockResponse();
        const req = mockRequest({ nome: 'Roberto' }); // All other user data is missing in this body

        const handler = new UserHandler();
        await handler.createHandle(req, res);

        expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(res.json.message).toEqual('"userId" is required');
    });

    it('Should create an user w/ address and return correct status code', async () => {
        await initServer.post(`/api/users`);

        const res = mockResponse();
        const req = mockRequest({
            userId: '1',
            name: 'Roberto',
            email: 'roberto.lopes@gmail.com',
            address: 'Maria Aparecida Datovo, 478',
        });

        const handler = new UserHandler();
        await handler.createHandle(req, res);

        const response = res.json.response;
        expect(res.statusCode).toEqual(StatusCodes.CREATED);
        expect(response.address).toBeDefined();
        expect(response.coordinates).toBeDefined();
    });

    it('Should create an user w/ coordinates and return correct status code', async () => {
        await initServer.post(`/api/users`);

        const res = mockResponse();
        const req = mockRequest({
            userId: '1',
            name: 'Roberto',
            email: 'roberto.lopes@gmail.com',
            coordinates: {
                lat: -23.513803,
                lng: -46.3684184,
            },
        });

        const handler = new UserHandler();
        await handler.createHandle(req, res);

        const response = res.json.response;
        expect(res.statusCode).toEqual(StatusCodes.CREATED);
        expect(response.address).toBeDefined();
        expect(response.coordinates).toBeDefined();
    });
});
