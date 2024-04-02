import { Variant } from "@dfinity/candid/lib/cjs/idl";
import {
  $query,
  $update,
  Record,
  StableBTreeMap,
  Vec,
  match,
  Result,
  nat64,
  ic,
  Opt,
  Principal,
} from "azle";
import { v4 as uuidv4 } from "uuid";

// Poultry Record
type PoultryRecord = Record<{
  id: string;
  record_name: string;
  age_month: number;
  weight_kg: number;
  health_status: string;
  category: string;
  creator: Principal;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;

type PoultryRecordPayload = Record<{
  record_name: string;
  age_month: number;
  weight_kg: number;
  health_status: string;
  category: string;
}>;

// Egg Record
type EggRecord = Record<{
  id: string;
  egg_type: string;
  total_egg_count: number;
  cracked_egg_count: number;
  creator: Principal;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;

type EggRecordPayload = Record<{
  egg_type: string;
  total_egg_count: number;
  cracked_egg_count: number;
}>;

// Egg Price
type EggPrice = Record<{
  id: string;
  price: number;
  egg_type: string;
  createdAt: nat64;
  updatedAt: Opt<nat64>;
}>;

// Egg Price Payload
type EggPricePayload = Record<{
  price: number;
  egg_type: string;
}>;

// Poultry Record Storage
const PoultryRecordStorage = new StableBTreeMap<string, PoultryRecord>(
  0,
  44,
  512
);

// Egg Record Storage
const EggRecordStorage = new StableBTreeMap<string, EggRecord>(1, 44, 512);

// Egg Price Storage
const EggPriceStorage = new StableBTreeMap<string, EggPrice>(2, 44, 512);

// Number of Poultry Records to load Initially.
const initialPoultryRecordLoadSize = 5;

// Add a new poultry record
$update;
export function addPoultryRecord(
  payload: PoultryRecordPayload
): Result<PoultryRecord, string> {
  // Validate user input
  if (
    !payload.record_name ||
    !payload.age_month ||
    !payload.weight_kg ||
    !payload.health_status
  ) {
    return Result.Err<PoultryRecord, string>("Invalid input");
  }

  try {
    const newPoultryRecord: PoultryRecord = {
      id: uuidv4(),
      createdAt: ic.time(),
      updatedAt: Opt.None,
      creator: ic.caller(),
      ...payload,
    };
    PoultryRecordStorage.insert(newPoultryRecord.id, newPoultryRecord);
    return Result.Ok<PoultryRecord, string>(newPoultryRecord);
  } catch (err) {
    return Result.Err<PoultryRecord, string>("Failed to add record");
  }
}

// Loading a specific poultry record
$query;
export function getPoultryRecord(id: string): Result<PoultryRecord, string> {
  // Validate the input
  if (!id) {
    return Result.Err<PoultryRecord, string>("id is required");
  }

  return match(PoultryRecordStorage.get(id), {
    Some: (record) => Result.Ok<PoultryRecord, string>(record),
    None: () =>
      Result.Err<PoultryRecord, string>(
        `couldn't find a financial record with id=${id}`
      ),
  });
}

// Loading poultry records
$query;
export function getPoultryRecords(): Result<Vec<PoultryRecord>, string> {
  try {
    const records = PoultryRecordStorage.values();
    if (records.length === 0) {
      return Result.Err<Vec<PoultryRecord>, string>("No poultry records found");
    }
    return Result.Ok(records);
  } catch (error) {
    return Result.Err(
      "An unexpected error occurred while trying to load poultry records"
    );
  }
}

// Load the initial poultry records
$query;
export function getInitialPoultryRecords(): Result<Vec<PoultryRecord>, string> {
  const initialRecords = PoultryRecordStorage.values().slice(
    0,
    initialPoultryRecordLoadSize
  );
  if (initialRecords.length === 0) {
    return Result.Err<Vec<PoultryRecord>, string>("No poultry records found");
  }
  return Result.Ok(initialRecords);
}

// Load the next set of poultry records
$query
export function getNextPoultryRecords(
  start: number,
  end: number
): Result<Vec<PoultryRecord>, string> {
  let total_records = PoultryRecordStorage.values().length;

  if (start >= end){
    return Result.Err("Invalid range: start index must be less than end index.".toString());
  } else if (end > total_records) {
    return Result.Err("Invalid range: end index must be less than the total number of records.".toString());
  }

  let records = PoultryRecordStorage.values().slice(start, end);
  return Result.Ok(records);
}

// Fetch Poultry Records by Creator
$query;
export function getPoultryRecordsByCreator(
  creator: Principal
): Result<Vec<PoultryRecord>, string> {
  // Validate the input
  if (!creator) {
    return Result.Err<Vec<PoultryRecord>, string>("creator id  is required");
  }
  try {
    const records = PoultryRecordStorage.values().filter(
      (record) => record.creator === creator
    );
    if (records.length === 0) {
      return Result.Err<Vec<PoultryRecord>, string>(
        "No poultry records found for the specified creator."
      );
    }
    return Result.Ok(records);
  } catch (error) {
    return Result.Err(
      "An unexpected error occurred while trying to load poultry records"
    );
  }
}

// Fetch Poultry Records by Category
$query;
export function getPoultryRecordsByCategory(
  category: string
): Result<Vec<PoultryRecord>, string> {
  // Validate the input
  if (!category) {
    return Result.Err<Vec<PoultryRecord>, string>("category is required");
  }
  try {
    const records = PoultryRecordStorage.values().filter(
      (record) => record.category === category
    );
    if (records.length === 0) {
      return Result.Err<Vec<PoultryRecord>, string>(
        "No poultry records found for the specified category."
      );
    }
    return Result.Ok(records);
  } catch (error) {
    return Result.Err(
      "An unexpected error occurred while trying to load poultry records"
    );
  }
}

// Fetch Poultry Records by health status
$query;
export function getPoultryRecordsByHealthStatus(
  health_status: string
): Result<Vec<PoultryRecord>, string> {
  // Validate the input
  if (!health_status) {
    return Result.Err<Vec<PoultryRecord>, string>("health status is required");
  }
  try {
    const records = PoultryRecordStorage.values().filter(
      (record) => record.health_status === health_status
    );
    if (records.length === 0) {
      return Result.Err<Vec<PoultryRecord>, string>(
        "No poultry records found for the specified health status."
      );
    }
    return Result.Ok(records);
  } catch (error) {
    return Result.Err(
      "An unexpected error occurred while trying to load poultry records"
    );
  }
}

// Updating a poultry record
$update;
export function updatePoultryRecord(
  id: string,
  payload: PoultryRecordPayload
): Result<PoultryRecord, string> {
  // Validate the input
  if (
    !payload.age_month ||
    !payload.category ||
    !payload.health_status ||
    !payload.record_name ||
    !payload.weight_kg
  ) {
    return Result.Err<PoultryRecord, string>("Invalid input");
  }

  return match(PoultryRecordStorage.get(id), {
    Some: (record) => {
      const updateRecord: PoultryRecord = {
        ...record,
        ...payload,
        updatedAt: Opt.Some(ic.time()),
      };

      PoultryRecordStorage.insert(record.id, updateRecord);
      return Result.Ok<PoultryRecord, string>(updateRecord);
    },
    None: () =>
      Result.Err<PoultryRecord, string>(
        `couldn't find a poultry record with id=${id}, record not found`
      ),
  });
}

// Deleting a poultry record
$update;
export function deletePoultryRecord(id: string): Result<PoultryRecord, string> {
  // Validate the input
  if (!id) {
    return Result.Err<PoultryRecord, string>("id is required");
  }

  return match(PoultryRecordStorage.remove(id), {
    Some: (deletePoultryRecord) =>
      Result.Ok<PoultryRecord, string>(deletePoultryRecord),
    None: () =>
      Result.Err<PoultryRecord, string>(
        `couldn't find a poultry record with id=${id}, record not found`
      ),
  });
}

// Add a new egg record
$update;
export function addEggRecord(
  payload: EggRecordPayload
): Result<EggRecord, string> {
  // Validate user input
  if (!payload.egg_type || !payload.total_egg_count) {
    return Result.Err<EggRecord, string>("Invalid input");
  }

  try {
    const newEggRecord: EggRecord = {
      id: uuidv4(),
      createdAt: ic.time(),
      updatedAt: Opt.None,
      creator: ic.caller(),
      ...payload,
    };
    EggRecordStorage.insert(newEggRecord.id, newEggRecord);
    return Result.Ok<EggRecord, string>(newEggRecord);
  } catch (err) {
    return Result.Err<EggRecord, string>("Failed to add record");
  }
}

// Loading a specific egg record
$query;
export function getEggRecord(id: string): Result<EggRecord, string> {
  // Validate the input
  if (!id) {
    return Result.Err<EggRecord, string>("id is required");
  }

  return match(EggRecordStorage.get(id), {
    Some: (record) => Result.Ok<EggRecord, string>(record),
    None: () =>
      Result.Err<EggRecord, string>(
        `couldn't find a financial record with id=${id}`
      ),
  });
}

// Loading egg records
$query;
export function getEggRecords(): Result<Vec<EggRecord>, string> {
  try {
    const records = EggRecordStorage.values();
    if (records.length === 0) {
      return Result.Err<Vec<EggRecord>, string>("No egg records found");
    }
    return Result.Ok(records);
  } catch (error) {
    return Result.Err(
      "An unexpected error occurred while trying to load egg records"
    );
  }
}

// Load the initial egg records
$query;
export function getInitialEggRecords(): Result<Vec<EggRecord>, string> {
  const initialRecords = EggRecordStorage.values().slice(0, initialPoultryRecordLoadSize);
  if (initialRecords.length === 0) {
    return Result.Err<Vec<EggRecord>, string>("No egg records found");
  }
  return Result.Ok(initialRecords);
}

// Load the next set of egg records
$query
export function getNextEggRecords(
  start: number,
  end: number
): Result<Vec<EggRecord>, string> {
  let total_records = EggRecordStorage.values().length;

  if (start >= end){
    return Result.Err("Invalid range: start index must be less than end index.".toString());
  } else if (end > total_records) {
    return Result.Err("Invalid range: end index must be less than the total number of records.".toString());
  }

  let records = EggRecordStorage.values().slice(start, end);
  return Result.Ok(records);
}

// Fetch Egg Records by Creator
$query;
export function getEggRecordsByCreator(
  creator: Principal
): Result<Vec<EggRecord>, string> {
  // Validate the input
  if (!creator) {
    return Result.Err<Vec<EggRecord>, string>("creator id  is required");
  }
  try {
    const records = EggRecordStorage.values().filter(
      (record) => record.creator === creator
    );
    if (records.length === 0) {
      return Result.Err<Vec<EggRecord>, string>(
        "No egg records found for the specified creator."
      );
    }
    return Result.Ok(records);
  } catch (error) {
    return Result.Err(
      "An unexpected error occurred while trying to load egg records"
    );
  }
}

// Fetch Egg Records by Egg Type
$query;
export function getEggRecordsByEggType(
  egg_type: string
): Result<Vec<EggRecord>, string> {
  // Validate the input
  if (!egg_type) {
    return Result.Err<Vec<EggRecord>, string>("egg type is required");
  }
  try {
    const records = EggRecordStorage.values().filter(
      (record) => record.egg_type === egg_type
    );
    if (records.length === 0) {
      return Result.Err<Vec<EggRecord>, string>(
        "No egg records found for the specified egg type."
      );
    }
    return Result.Ok(records);
  } catch (error) {
    return Result.Err(
      "An unexpected error occurred while trying to load egg records"
    );
  }
}

// Updating an egg record
$update;
export function updateEggRecord(
  id: string,
  payload: EggRecordPayload
): Result<EggRecord, string> {
  // Validate the input
  if (!payload.egg_type || !payload.total_egg_count) {
    return Result.Err<EggRecord, string>("Invalid input");
  }

  return match(EggRecordStorage.get(id), {
    Some: (record) => {
      const updateRecord: EggRecord = {
        ...record,
        ...payload,
        updatedAt: Opt.Some(ic.time()),
      };

      EggRecordStorage.insert(record.id, updateRecord);
      return Result.Ok<EggRecord, string>(updateRecord);
    },
    None: () =>
      Result.Err<EggRecord, string>(
        `couldn't find a egg record with id=${id}, record not found`
      ),
  });
}

// Deleting an egg record
$update;
export function deleteEggRecord(id: string): Result<EggRecord, string> {
  // Validate the input
  if (!id) {
    return Result.Err<EggRecord, string>("id is required");
  }

  return match(EggRecordStorage.remove(id), {
    Some: (deleteEggRecord) =>
      Result.Ok<EggRecord, string>(deleteEggRecord),
    None: () =>
      Result.Err<EggRecord, string>(
        `couldn't find a egg record with id=${id}, record not found`
      ),
  });
}

// Add a new egg price
$update;
export function addEggPrice(
  payload: EggPricePayload
): Result<EggPrice, string> {
  // Validate user input
  if (!payload.egg_type || !payload.price) {
    return Result.Err<EggPrice, string>("Invalid input");
  }

  try {
    const newEggPrice: EggPrice = {
      id: uuidv4(),
      createdAt: ic.time(),
      updatedAt: Opt.None,
      ...payload,
    };
    EggPriceStorage.insert(newEggPrice.id, newEggPrice);
    return Result.Ok<EggPrice, string>(newEggPrice);
  } catch (err) {
    return Result.Err<EggPrice, string>("Failed to add record");
  }
}

// Loading a specific egg price
$query;
export function getEggPrice(id: string): Result<EggPrice, string> {
  // Validate the input
  if (!id) {
    return Result.Err<EggPrice, string>("id is required");
  }

  return match(EggPriceStorage.get(id), {
    Some: (record) => Result.Ok<EggPrice, string>(record),
    None: () =>
      Result.Err<EggPrice, string>(
        `couldn't find a financial record with id=${id}`
      ),
  });
}

// Loading egg prices
$query;
export function getEggPrices(): Result<Vec<EggPrice>, string> {
  try {
    const records = EggPriceStorage.values();
    if (records.length === 0) {
      return Result.Err<Vec<EggPrice>, string>("No egg prices found");
    }
    return Result.Ok(records);
  } catch (error) {
    return Result.Err(
      "An unexpected error occurred while trying to load egg prices"
    );
  }
}

// Load the initial egg prices
$query;
export function getInitialEggPrices(): Result<Vec<EggPrice>, string> {
  const initialRecords = EggPriceStorage.values().slice(0, initialPoultryRecordLoadSize);
  if (initialRecords.length === 0) {
    return Result.Err<Vec<EggPrice>, string>("No egg prices found");
  }
  return Result.Ok(initialRecords);
}

// Load the next set of egg prices
$query
export function getNextEggPrices(
  start: number,
  end: number
): Result<Vec<EggPrice>, string> {
  let total_records = EggPriceStorage.values().length;

  if (start >= end){
    return Result.Err("Invalid range: start index must be less than end index.".toString());
  } else if (end > total_records) {
    return Result.Err("Invalid range: end index must be less than the total number of records.".toString());
  }

  let records = EggPriceStorage.values().slice(start, end);
  return Result.Ok(records);
}

// Fetch Egg Prices by Egg Type
$query;
export function getEggPricesByEggType(
  egg_type: string
): Result<Vec<EggPrice>, string> {
  // Validate the input
  if (!egg_type) {
    return Result.Err<Vec<EggPrice>, string>("egg type is required");
  }
  try {
    const records = EggPriceStorage.values().filter(
      (record) => record.egg_type === egg_type
    );
    if (records.length === 0) {
      return Result.Err<Vec<EggPrice>, string>(
        "No egg prices found for the specified egg type."
      );
    }
    return Result.Ok(records);
  } catch (error) {
    return Result.Err(
      "An unexpected error occurred while trying to load egg prices"
    );
  }
}

// Updating an egg price
$update;
export function updateEggPrice(
  id: string,
  payload: EggPricePayload
): Result<EggPrice, string> {
  // Validate the input
  if (!payload.egg_type || !payload.price) {
    return Result.Err<EggPrice, string>("Invalid input");
  }

  return match(EggPriceStorage.get(id), {
    Some: (record) => {
      const updateRecord: EggPrice = {
        ...record,
        ...payload,
        updatedAt: Opt.Some(ic.time()),
      };

      EggPriceStorage.insert(record.id, updateRecord);
      return Result.Ok<EggPrice, string>(updateRecord);
    },
    None: () =>
      Result.Err<EggPrice, string>(
        `couldn't find a egg price with id=${id}, record not found`
      ),
  });
}

// Deleting an egg price
$update;
export function deleteEggPrice(id: string): Result<EggPrice, string> {
  // Validate the input
  if (!id) {
    return Result.Err<EggPrice, string>("id is required");
  }

  return match(EggPriceStorage.remove(id), {
    Some: (deleteEggPrice) =>
      Result.Ok<EggPrice, string>(deleteEggPrice),
    None: () =>
      Result.Err<EggPrice, string>(
        `couldn't find a egg price with id=${id}, record not found`
      ),
  });
}

// UUID workaround
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
