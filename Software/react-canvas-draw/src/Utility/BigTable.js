"use strict";

//2024-03-20: copied from https://cloud.google.com/bigtable/docs/reference/libraries#client-libraries-install-nodejs

// Imports the Google Cloud client library
const {Bigtable} = require('@google-cloud/bigtable');

const bigtable = new Bigtable();

const INSTANCE_ID = "creaturecombat";
const TABLE_ID = "creature";

export async function quickstart() {
    console.log("quickstart called");
  // Connect to an existing instance:my-bigtable-instance
  const instance = bigtable.instance(INSTANCE_ID);
  console.log("quickstart called: instance",instance);

  // Connect to an existing table:my-table
  const table = instance.table(TABLE_ID);
  console.log("quickstart called: table",table);

  // Read a row from my-table using a row key
  const [singleRow] = await table.row('sg7#ABC').get();
  console.log("quickstart called: singleRow",singleRow);

  // Print the row key and data (column value, labels, timestamp)
  const rowData = JSON.stringify(singleRow.data, null, 4);
  console.log(`Row key: ${singleRow.id}\nData: ${rowData}`);
}
