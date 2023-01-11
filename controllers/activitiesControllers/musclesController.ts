import { Request, Response } from 'express';
import  *  as ResponseCodes from '../errorControllers/responseCodes';
import MuscleHandler from '../../models/activitiesModels/muscleModel';

/** APIS */
export const apiGetMuscles = async (req: Request, res: Response) => {
  res.json(await MuscleHandler.getAllNames());
};

export const apiGetMuscleNames = async (req: Request, res: Response) => {
  res.json(await MuscleHandler.fetchAllNames());
};

export const apiAddMuscle = async (req: Request, res: Response) => {
  let muscleHandler = new MuscleHandler(req.body);

  console.log('muscleHandler: ', muscleHandler);
  //TODO: Implement an error catcher
  muscleHandler.save().then( response => {
    res.json(ResponseCodes.RESPONSE_ADDED_SUCCESSFULLY());
    console.log('response: ', response);
  });
};

export const apiDeleteMuscle = async (req: Request, res: Response) => {
  const muscleId: string = req.params.muscleId;

  MuscleHandler.deleteById(muscleId)
  .then( deleteResponse => {
    //removes the muscle from muscles 
    MuscleHandler.removeNameById(muscleId);
    console.log(`'${deleteResponse.name}' physical muscle deleted successfully.`);
    res.redirect(`/activities/muscle/`);
  })
  .catch(err => {
    console.log('Error while deleting Muscle: ', err);
  });
};