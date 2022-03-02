# Import to Mongo via the command line

## Some helpful links:
https://docs.mongodb.com/guides/server/import/

https://kb.objectrocket.com/mongo-db/how-to-import-a-csv-into-mongodb-327

## The basic command:

mongoimport --uri mongodb+srv://<span style="color:rgb(0, 128, 255)">\<***USERNAME***></span>:<span style="color:rgb(0, 128, 255)">\<***PASSWORD***></span>@cluster0.lvj8x.mongodb.net/<span style="color:rgb(0, 128, 255)">\<***DATABASE***></span>--collection <span style="color:rgb(0, 128, 255)">\<***COLLECTION***></span> --type <span style="color:rgb(0, 128, 255)">\<***FILETYPE***></span> --file <span style="color:rgb(0, 128, 255)">\<***FILENAME***></span>


Run the above command via terminal in the same folder as the file to be uploaded.

## For csv files:
\<FILETYPE> is CSV

\<FILENAME> should have a ".csx suffix

Add the following to the command:

> --headerline --drop

* –headerline: Specifies that the first row in our csv file should be the field names.
* –drop: Specifies that we want to drop the collection before importing documents.