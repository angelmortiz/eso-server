import {Request, Response} from 'express';
import  *  as ResponseCodes from '../errorControllers/responseCodes';
import PhysicalConditionHandler from '../../models/activitiesModels/physicalConditionModel';

/** APIS */
export const apiGetPhysicalConditions = async (req: Request, res: Response) => {
  res.json(await PhysicalConditionHandler.getAllNames());
};

export const apiGetPhysicalConditionNames = async (req: Request, res: Response) => {
  res.json(await PhysicalConditionHandler.fetchAllNames());
};

export const apiAddPhysicalCondition = async (req: Request, res: Response) => {
  let physicalconditionHandler = new PhysicalConditionHandler(req.body);
  //TODO: Implement an error catcher
  physicalconditionHandler.save().then( _ => res.json(ResponseCodes.RESPONSE_ADDED_SUCCESSFULLY()) );
};

export const apiDeletePhysicalCondition = async (req: Request, res: Response) => {
  const physicalConditionId: string = req.params.physicalConditionId;

  PhysicalConditionHandler.deleteById(physicalConditionId)
  .then( deleteResponse => {
    //removes the physicalCondition from physicalConditions dropdown
    PhysicalConditionHandler.removeNameById(physicalConditionId);
    console.log(`'${deleteResponse.name}' physical condition deleted successfully.`);
    res.redirect(`/activities/physicalCondition/`);
  })
  .catch(err => {
    console.log('Error while deleting PhysicalCondition: ', err);
  });
};