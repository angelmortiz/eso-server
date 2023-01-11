import { Request, Response } from 'express';
import  *  as ResponseCodes from '../general/responseCodes';
import EquipmentHandler from '../../models/activitiesModels/equipmentModel';

/** APIS */
export const apiGetEquipments = async (req: Request, res: Response) => {
  res.json(await EquipmentHandler.getAllNames());
};

export const apiGetEquipmentNames = async (req: Request, res: Response) => {
  res.json(await EquipmentHandler.fetchAllNames());
};

export const apiAddEquipment = (req: Request, res: Response) => {
  let equipmentHandler = new EquipmentHandler(req.body);

  //TODO: Implement an error catcher
  equipmentHandler.save().then( _ => res.json(ResponseCodes.RESPONSE_ADDED_SUCCESSFULLY()) );
};

export const apiDeleteEquipment = (req: Request, res: Response) => {
  const equipmentId: string = req.params.equipmentId;

  EquipmentHandler.deleteById(equipmentId)
  .then( deleteResponse => {
    //removes the equipment from equipments dropdown
    EquipmentHandler.removeNameById(equipmentId);
    console.log(`'${deleteResponse.name}' physical equipment deleted successfully.`);
    res.redirect(`/activities/equipment/`);
  })
  .catch(err => {
    console.log('Error while deleting Equipment: ', err);
  });
};