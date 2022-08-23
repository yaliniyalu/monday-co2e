const mondaySdk = require("monday-sdk-js");
const axios = require("axios");

/** @type {MondayServerSdk} */
const sdk = mondaySdk();

async function setWebHookForColumn(boardId, columnId, token) {
    const mutation = `
mutation {
    create_webhook (board_id: ${boardId}, url: "${process.env.MONDAY_WEBHOOK_URL}", event: change_specific_column_value, config: "{\\"columnId\\": \\"${columnId}\\"}") {
        id
        board_id
    }
}`

    sdk.setToken(token);
    const res = await sdk.api(mutation);
    return res.data.create_webhook;
}

async function deleteWebHook(webhookId, token) {
    const mutation = `
mutation {
    delete_webhook (id: ${webhookId}) {
        id
    }
}`
    sdk.setToken(token);
    const res = await sdk.api(mutation);
    return res.data.delete_webhook;
}

async function getItem(itemId, token) {
    const query = `
query {
    items(ids: [${itemId}]) {
        id
        name
        column_values {
            id
            text
            value
            type
        }
    }
}`
    sdk.setToken(token);
    const res = await sdk.api(query);
    if (res.data.items.length === 0) {
        return null;
    }

    return res.data.items[0];
}

async function createItem(boardId, token) {
    const mutation = `
mutation {
    create_item (board_id: ${boardId}, item_name: "Temp Item") {
        id
    }
}`
    sdk.setToken(token);
    const res = await sdk.api(mutation);
    return res.data.create_item;
}

async function getColumns(boardId, token) {
    const query = `
query {
  	boards(ids: [${boardId}]) {
    	columns {
        id,
        settings_str,
        type
      }
  }
}`
    sdk.setToken(token);
    const res = await sdk.api(query);
    return res.data.boards[0].columns;
}

async function updateColumn(boardId, itemId, columnId, value, token) {
    const mutation = `
mutation {
    change_simple_column_value (board_id: ${boardId}, item_id: ${itemId}, column_id: ${columnId}, value: "${value}") {
        id
    }
}`
    sdk.setToken(token);
    const res = await sdk.api(mutation);
    return res.data.change_simple_column_value;
}

async function triggerAction(url, fields) {
    await axios.post(url, {
        trigger: {
            outputFields: fields
        }
    }, {headers: {Authorization: `${process.env.MONDAY_SIGNING_SECRET}`}});
}

async function runQuery(query, token) {
    sdk.setToken(token);
    const res = await sdk.api(query);
    return res.data;
}

module.exports = {
    setWebHookForColumn,
    deleteWebHook,
    getItem,
    createItem,
    updateColumn,
    getColumns,
    triggerAction,
    runQuery
}
