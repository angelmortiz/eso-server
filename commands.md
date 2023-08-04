# Important Commands

### Database Commands
**Mongo Dump (Backup):**
mongodump --uri="mongodb+srv://username:<PASSWORD>@cluster/ensaludoptimadb_<DBENV>?retryWrites=true&w=majority"


**Mongo Restore into another database:**
mongorestore --uri="mongodb+srv://newusername:<NEWPASSWORD>@newcluster.mongodb.net/newdatabase" --nsInclude="ensaludoptimadb_<DBENV>.*" --nsFrom="ensaludoptimadb_<DBENV>.*" --nsTo="newdatabase.*" /path/to/your/dump/ensaludoptimadb_<DBENV>