// Vehicles controller: catalog list/details (public) and CRUD (admin).
import * as vehiclesService from '../services/vehicles.service.js';

export async function list(req, res, next) {
  try {
    const vehicles = await vehiclesService.listVehicles(req.query);
    res.json({ vehicles: vehicles });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const vehicle = await vehiclesService.getVehicle(req.params.id);
    res.json({ vehicle: vehicle });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const vehicle = await vehiclesService.createVehicle(req.body);
    res.status(201).json({ vehicle: vehicle });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const vehicle = await vehiclesService.updateVehicle(req.params.id, req.body);
    res.json({ vehicle: vehicle });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await vehiclesService.deleteVehicle(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
