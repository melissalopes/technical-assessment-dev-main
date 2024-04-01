import * as GeoJson from 'geojson';
import { RegionRepository, UserRepository } from '../repository';
import { RegionReqDTO } from './dto';
import { NotFound } from '../utils';
import { UserErrorMessagesConstants } from '../constant';

export class RegionLogic {
    private regionRepository: RegionRepository;
    private userRepository: UserRepository;

    constructor() {
        this.regionRepository = new RegionRepository();
        this.userRepository = new UserRepository();
    }

    async create(data: RegionReqDTO): Promise<any> {
        const { regionId, name, userId } = data;
        try {
            console.log('Calling RegionLogic.create', data);

            const user = await this.userRepository.find(userId);

            if (!user) throw new NotFound(UserErrorMessagesConstants.NOT_FOUND);

            const region = GeoJson.parse(user.coordinates, {
                Polygon: ['lat', 'lng'],
            });

            return await this.regionRepository.create({
                regionId,
                user: user._id,
                name,
                region,
            });
        } catch (error) {
            console.log('Error in RegionLogic.create', error);
            throw error;
        }
    }
}
