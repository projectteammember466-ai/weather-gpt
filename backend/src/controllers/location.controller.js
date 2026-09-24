import { successResponse } from '../utils/response.utils.js';
import { searchLocations } from '../services/location.service.js';

export async function search(req, res, next) {
  try {
    const query = req.validatedQuery;
    const locations = await searchLocations(query);
    return successResponse(res, locations);
  } catch (err) {
    next(err);
  }
}

export default {
  search
};
