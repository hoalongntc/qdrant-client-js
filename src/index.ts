/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ErrorResponse {
  /**
   * Time spent to process this request
   * @format float
   */
  time?: number;
  status?: {
    /** Description of the occurred error. */
    error?: string;
  };
  result?: object | null;
}

export interface CollectionsResponse {
  collections: CollectionDescription[];
}

export interface CollectionDescription {
  name: string;
}

/** Current statistics and configuration of the collection */
export interface CollectionInfo {
  /** Current state of the collection. `Green` - all good. `Yellow` - optimization is running, `Red` - some operations failed and was not recovered */
  status: CollectionStatus;
  /** Current state of the collection */
  optimizer_status: OptimizersStatus;
  /**
   * Number of vectors in collection All vectors in collection are available for querying Calculated as `points_count x vectors_per_point` Where `vectors_per_point` is a number of named vectors in schema
   * @format uint
   * @min 0
   */
  vectors_count: number;
  /**
   * Number of indexed vectors in the collection. Indexed vectors in large segments are faster to query, as it is stored in vector index (HNSW)
   * @format uint
   * @min 0
   */
  indexed_vectors_count: number;
  /**
   * Number of points (vectors + payloads) in collection Each point could be accessed by unique id
   * @format uint
   * @min 0
   */
  points_count: number;
  /**
   * Number of segments in collection. Each segment has independent vector as payload indexes
   * @format uint
   * @min 0
   */
  segments_count: number;
  config: CollectionConfig;
  /** Types of stored payload */
  payload_schema: Record<string, PayloadIndexInfo>;
}

/** Current state of the collection. `Green` - all good. `Yellow` - optimization is running, `Red` - some operations failed and was not recovered */
export enum CollectionStatus {
  Green = 'green',
  Yellow = 'yellow',
  Red = 'red',
}

/** Current state of the collection */
export type OptimizersStatus =
  | 'ok'
  | {
      error: string;
    };

export interface CollectionConfig {
  params: CollectionParams;
  /** Config of HNSW index */
  hnsw_config: HnswConfig;
  optimizer_config: OptimizersConfig;
  wal_config: WalConfig;
  /** @default null */
  quantization_config?: QuantizationConfig;
}

export interface CollectionParams {
  /**
   * Vector params separator for single and multiple vector modes Single mode:
   *
   * { "size": 128, "distance": "Cosine" }
   *
   * or multiple mode:
   *
   * { "default": { "size": 128, "distance": "Cosine" } }
   */
  vectors: VectorsConfig;
  /**
   * Number of shards the collection has
   * @format uint32
   * @min 1
   * @default 1
   */
  shard_number?: number;
  /**
   * Number of replicas for each shard
   * @format uint32
   * @min 1
   * @default 1
   */
  replication_factor?: number;
  /**
   * Defines how many replicas should apply the operation for us to consider it successful. Increasing this number will make the collection more resilient to inconsistencies, but will also make it fail if not enough replicas are available. Does not have any performance impact.
   * @format uint32
   * @min 1
   * @default 1
   */
  write_consistency_factor?: number;
  /**
   * If true - point's payload will not be stored in memory. It will be read from the disk every time it is requested. This setting saves RAM by (slightly) increasing the response time. Note: those payload values that are involved in filtering and are indexed - remain in RAM.
   * @default false
   */
  on_disk_payload?: boolean;
}

/**
 * Vector params separator for single and multiple vector modes Single mode:
 *
 * { "size": 128, "distance": "Cosine" }
 *
 * or multiple mode:
 *
 * { "default": { "size": 128, "distance": "Cosine" } }
 */
export type VectorsConfig =
  | VectorParams
  | Record<string, VectorParams>
  | (VectorParams & Record<string, VectorParams>);

/** Params of single vector data storage */
export interface VectorParams {
  /**
   * Size of a vectors used
   * @format uint64
   * @min 1
   */
  size: number;
  /** Type of internal tags, build from payload Distance function types used to compare vectors */
  distance: Distance;
  /** Custom params for HNSW index. If none - values from collection configuration are used. */
  hnsw_config?: HnswConfigDiff;
  /** Custom params for quantization. If none - values from collection configuration are used. */
  quantization_config?: QuantizationConfig;
}

/** Type of internal tags, build from payload Distance function types used to compare vectors */
export enum Distance {
  Cosine = 'Cosine',
  Euclid = 'Euclid',
  Dot = 'Dot',
}

export interface HnswConfigDiff {
  /**
   * Number of edges per node in the index graph. Larger the value - more accurate the search, more space required.
   * @format uint
   * @min 4
   * @max 10000
   */
  m?: number | null;
  /**
   * Number of neighbours to consider during the index building. Larger the value - more accurate the search, more time required to build the index.
   * @format uint
   * @min 4
   */
  ef_construct?: number | null;
  /**
   * Minimal size (in KiloBytes) of vectors for additional payload-based indexing. If payload chunk is smaller than `full_scan_threshold_kb` additional indexing won't be used - in this case full-scan search should be preferred by query planner and additional indexing is not required. Note: 1Kb = 1 vector of size 256
   * @format uint
   * @min 1000
   */
  full_scan_threshold?: number | null;
  /**
   * Number of parallel threads used for background index building. If 0 - auto selection.
   * @format uint
   * @min 1000
   */
  max_indexing_threads?: number | null;
  /** Store HNSW index on disk. If set to false, the index will be stored in RAM. Default: false */
  on_disk?: boolean | null;
  /**
   * Custom M param for additional payload-aware HNSW links. If not set, default M will be used.
   * @format uint
   * @min 0
   */
  payload_m?: number | null;
}

export type QuantizationConfig = ScalarQuantization;

export interface ScalarQuantization {
  scalar: ScalarQuantizationConfig;
}

export interface ScalarQuantizationConfig {
  type: ScalarType;
  /**
   * Quantile for quantization. Expected value range in [0.5, 1.0]. If not set - use the whole range of values
   * @format float
   * @min 0.5
   * @max 1
   */
  quantile?: number | null;
  /** If true - quantized vectors always will be stored in RAM, ignoring the config of main storage */
  always_ram?: boolean | null;
}

export enum ScalarType {
  Int8 = 'int8',
}

/** Config of HNSW index */
export interface HnswConfig {
  /**
   * Number of edges per node in the index graph. Larger the value - more accurate the search, more space required.
   * @format uint
   * @min 4
   * @max 10000
   */
  m: number;
  /**
   * Number of neighbours to consider during the index building. Larger the value - more accurate the search, more time required to build index.
   * @format uint
   * @min 4
   */
  ef_construct: number;
  /**
   * Minimal size (in KiloBytes) of vectors for additional payload-based indexing. If payload chunk is smaller than `full_scan_threshold_kb` additional indexing won't be used - in this case full-scan search should be preferred by query planner and additional indexing is not required. Note: 1Kb = 1 vector of size 256
   * @format uint
   * @min 0
   */
  full_scan_threshold: number;
  /**
   * Number of parallel threads used for background index building. If 0 - auto selection.
   * @format uint
   * @min 0
   * @default 0
   */
  max_indexing_threads?: number;
  /** Store HNSW index on disk. If set to false, index will be stored in RAM. Default: false */
  on_disk?: boolean | null;
  /**
   * Custom M param for hnsw graph built for payload index. If not set, default M will be used.
   * @format uint
   * @min 0
   */
  payload_m?: number | null;
}

export interface OptimizersConfig {
  /**
   * The minimal fraction of deleted vectors in a segment, required to perform segment optimization
   * @format double
   * @min 0
   * @max 1
   */
  deleted_threshold: number;
  /**
   * The minimal number of vectors in a segment, required to perform segment optimization
   * @format uint
   * @min 100
   */
  vacuum_min_vector_number: number;
  /**
   * Target amount of segments optimizer will try to keep. Real amount of segments may vary depending on multiple parameters: - Amount of stored points - Current write RPS
   *
   * It is recommended to select default number of segments as a factor of the number of search threads, so that each segment would be handled evenly by one of the threads. If `default_segment_number = 0`, will be automatically selected by the number of available CPUs.
   * @format uint
   * @min 0
   */
  default_segment_number: number;
  /**
   * Do not create segments larger this size (in KiloBytes). Large segments might require disproportionately long indexation times, therefore it makes sense to limit the size of segments.
   *
   * If indexation speed have more priority for your - make this parameter lower. If search speed is more important - make this parameter higher. Note: 1Kb = 1 vector of size 256 If not set, will be automatically selected considering the number of available CPUs.
   * @format uint
   * @min 0
   * @default null
   */
  max_segment_size?: number | null;
  /**
   * Maximum size (in KiloBytes) of vectors to store in-memory per segment. Segments larger than this threshold will be stored as read-only memmaped file. To enable memmap storage, lower the threshold Note: 1Kb = 1 vector of size 256 If not set, mmap will not be used.
   * @format uint
   * @min 1000
   * @default null
   */
  memmap_threshold?: number | null;
  /**
   * Maximum size (in KiloBytes) of vectors allowed for plain index. Default value based on <https://github.com/google-research/google-research/blob/master/scann/docs/algorithms.md> Note: 1Kb = 1 vector of size 256
   * @format uint
   * @min 1000
   */
  indexing_threshold: number;
  /**
   * Minimum interval between forced flushes.
   * @format uint64
   * @min 0
   */
  flush_interval_sec: number;
  /**
   * Maximum available threads for optimization workers
   * @format uint
   * @min 0
   */
  max_optimization_threads: number;
}

export interface WalConfig {
  /**
   * Size of a single WAL segment in MB
   * @format uint
   * @min 1
   */
  wal_capacity_mb: number;
  /**
   * Number of WAL segments to create ahead of actually used ones
   * @format uint
   * @min 0
   */
  wal_segments_ahead: number;
}

/** Display payload field type & index information */
export interface PayloadIndexInfo {
  /** All possible names of payload types */
  data_type: PayloadSchemaType;
  params?: PayloadSchemaParams;
  /**
   * Number of points indexed with this index
   * @format uint
   * @min 0
   */
  points: number;
}

/** All possible names of payload types */
export enum PayloadSchemaType {
  Keyword = 'keyword',
  Integer = 'integer',
  Float = 'float',
  Geo = 'geo',
  Text = 'text',
}

/** Payload type with parameters */
export type PayloadSchemaParams = TextIndexParams;

export interface TextIndexParams {
  type: TextIndexType;
  tokenizer?: TokenizerType;
  /**
   * @format uint
   * @min 0
   */
  min_token_len?: number | null;
  /**
   * @format uint
   * @min 0
   */
  max_token_len?: number | null;
  /** If true, lowercase all tokens. Default: true */
  lowercase?: boolean | null;
}

export enum TextIndexType {
  Text = 'text',
}

export enum TokenizerType {
  Prefix = 'prefix',
  Whitespace = 'whitespace',
  Word = 'word',
}

export interface PointRequest {
  /** Look for points with ids */
  ids: ExtendedPointId[];
  /** Select which payload to return with the response. Default: All */
  with_payload?: WithPayloadInterface;
  /** Options for specifying which vector to include */
  with_vector?: WithVector;
}

/** Type, used for specifying point ID in user interface */
export type ExtendedPointId = any;

/** Options for specifying which payload to include or not */
export type WithPayloadInterface = string[] | PayloadSelector | (string[] & PayloadSelector);

/** Specifies how to treat payload selector */
export type PayloadSelector =
  | PayloadSelectorInclude
  | PayloadSelectorExclude
  | (PayloadSelectorInclude & PayloadSelectorExclude);

export interface PayloadSelectorInclude {
  /** Only include this payload keys */
  include: string[];
}

export interface PayloadSelectorExclude {
  /** Exclude this fields from returning payload */
  exclude: string[];
}

/** Options for specifying which vector to include */
export type WithVector = string[];

/** Point data */
export interface Point {
  /** Type, used for specifying point ID in user interface */
  id: ExtendedPointId;
  /** Payload - values assigned to the point */
  payload?: Payload;
  /** Vector of the point */
  vector?: VectorStruct;
}

export type Payload = Record<string, any>;

/** Full vector data per point separator with single and multiple vector modes */
export type VectorStruct =
  | number[]
  | Record<string, number[]>
  | (number[] & Record<string, number[]>);

/** Search request. Holds all conditions and parameters for the search of most similar points by vector similarity given the filtering restrictions. */
export interface SearchRequest {
  /**
   * Vector data separator for named and unnamed modes Unanmed mode:
   *
   * { "vector": [1.0, 2.0, 3.0] }
   *
   * or named mode:
   *
   * { "vector": { "vector": [1.0, 2.0, 3.0], "name": "image-embeddings" } }
   */
  vector: NamedVectorStruct;
  /** Look only for points which satisfies this conditions */
  filter?: Filter;
  /** Additional search params */
  params?: SearchParams;
  /**
   * Max number of result to return
   * @format uint
   * @min 0
   */
  limit: number;
  /**
   * Offset of the first result to return. May be used to paginate results. Note: large offset values may cause performance issues.
   * @format uint
   * @min 0
   * @default 0
   */
  offset?: number;
  /** Select which payload to return with the response. Default: None */
  with_payload?: WithPayloadInterface;
  /**
   * Whether to return the point vector with the result?
   * @default null
   */
  with_vector?: WithVector;
  /**
   * Define a minimal score threshold for the result. If defined, less similar results will not be returned. Score of the returned result might be higher or smaller than the threshold depending on the Distance function used. E.g. for cosine similarity only higher scores will be returned.
   * @format float
   */
  score_threshold?: number | null;
}

/**
 * Vector data separator for named and unnamed modes Unanmed mode:
 *
 * { "vector": [1.0, 2.0, 3.0] }
 *
 * or named mode:
 *
 * { "vector": { "vector": [1.0, 2.0, 3.0], "name": "image-embeddings" } }
 */
export type NamedVectorStruct = number[] | NamedVector | (number[] & NamedVector);

/** Vector data with name */
export interface NamedVector {
  /** Name of vector data */
  name: string;
  /** Vector data */
  vector: number[];
}

export interface Filter {
  /** At least one of those conditions should match */
  should?: Condition[] | null;
  /** All conditions must match */
  must?: Condition[] | null;
  /** All conditions must NOT match */
  must_not?: Condition[] | null;
}

export type Condition =
  | FieldCondition
  | IsEmptyCondition
  | IsNullCondition
  | HasIdCondition
  | Filter
  | (FieldCondition & IsEmptyCondition & IsNullCondition & HasIdCondition & Filter);

/** All possible payload filtering conditions */
export interface FieldCondition {
  /** Payload key */
  key: string;
  /** Check if point has field with a given value */
  match?: Match;
  /** Check if points value lies in a given range */
  range?: Range;
  /** Check if points geo location lies in a given area */
  geo_bounding_box?: GeoBoundingBox;
  /** Check if geo point is within a given radius */
  geo_radius?: GeoRadius;
  /** Check number of values of the field */
  values_count?: ValuesCount;
}

/** Match filter request */
export type Match = MatchValue | MatchText | MatchAny | (MatchValue & MatchText & MatchAny);

/** Exact match of the given value */
export interface MatchValue {
  value: ValueVariants;
}

export type ValueVariants = any;

/** Full-text match of the strings. */
export interface MatchText {
  text: string;
}

/** Exact match on any of the given values */
export interface MatchAny {
  any: AnyVariants;
}

export type AnyVariants = string[] | number[] | (string[] & number[]);

/** Range filter request */
export interface Range {
  /**
   * point.key < range.lt
   * @format double
   */
  lt?: number | null;
  /**
   * point.key > range.gt
   * @format double
   */
  gt?: number | null;
  /**
   * point.key >= range.gte
   * @format double
   */
  gte?: number | null;
  /**
   * point.key <= range.lte
   * @format double
   */
  lte?: number | null;
}

/**
 * Geo filter request
 *
 * Matches coordinates inside the rectangle, described by coordinates of lop-left and bottom-right edges
 */
export interface GeoBoundingBox {
  /** Geo point payload schema */
  top_left: GeoPoint;
  /** Geo point payload schema */
  bottom_right: GeoPoint;
}

/** Geo point payload schema */
export interface GeoPoint {
  /** @format double */
  lon: number;
  /** @format double */
  lat: number;
}

/**
 * Geo filter request
 *
 * Matches coordinates inside the circle of `radius` and center with coordinates `center`
 */
export interface GeoRadius {
  /** Geo point payload schema */
  center: GeoPoint;
  /**
   * Radius of the area in meters
   * @format double
   */
  radius: number;
}

/** Values count filter request */
export interface ValuesCount {
  /**
   * point.key.length() < values_count.lt
   * @format uint
   * @min 0
   */
  lt?: number | null;
  /**
   * point.key.length() > values_count.gt
   * @format uint
   * @min 0
   */
  gt?: number | null;
  /**
   * point.key.length() >= values_count.gte
   * @format uint
   * @min 0
   */
  gte?: number | null;
  /**
   * point.key.length() <= values_count.lte
   * @format uint
   * @min 0
   */
  lte?: number | null;
}

/** Select points with empty payload for a specified field */
export interface IsEmptyCondition {
  /** Payload field */
  is_empty: PayloadField;
}

/** Payload field */
export interface PayloadField {
  /** Payload field name */
  key: string;
}

/** Select points with null payload for a specified field */
export interface IsNullCondition {
  /** Payload field */
  is_null: PayloadField;
}

/** ID-based filtering condition */
export interface HasIdCondition {
  /** @uniqueItems true */
  has_id: ExtendedPointId[];
}

/** Additional parameters of the search */
export interface SearchParams {
  /**
   * Params relevant to HNSW index /// Size of the beam in a beam-search. Larger the value - more accurate the result, more time required for search.
   * @format uint
   * @min 0
   */
  hnsw_ef?: number | null;
  /**
   * Search without approximation. If set to true, search may run long but with exact results.
   * @default false
   */
  exact?: boolean;
  /**
   * Quantization params
   * @default null
   */
  quantization?: QuantizationSearchParams;
}

/** Additional parameters of the search */
export interface QuantizationSearchParams {
  /**
   * If true, quantized vectors are ignored. Default is false.
   * @default false
   */
  ignore?: boolean;
  /**
   * If true, use original vectors to re-score top-k results. Might require more time in case if original vectors are stored on disk. Default is false.
   * @default false
   */
  rescore?: boolean;
}

/** Search result */
export interface ScoredPoint {
  /** Type, used for specifying point ID in user interface */
  id: ExtendedPointId;
  /**
   * Point version
   * @format uint64
   * @min 0
   */
  version: number;
  /**
   * Points vector distance to the query vector
   * @format float
   */
  score: number;
  /** Payload - values assigned to the point */
  payload?: Payload;
  /** Vector of the point */
  vector?: VectorStruct;
}

export interface UpdateResult {
  /**
   * Sequential number of the operation
   * @format uint64
   * @min 0
   */
  operation_id: number;
  /** `Acknowledged` - Request is saved to WAL and will be process in a queue. `Completed` - Request is completed, changes are actual. */
  status: UpdateStatus;
}

/** `Acknowledged` - Request is saved to WAL and will be process in a queue. `Completed` - Request is completed, changes are actual. */
export enum UpdateStatus {
  Acknowledged = 'acknowledged',
  Completed = 'completed',
}

/**
 * Recommendation request. Provides positive and negative examples of the vectors, which are already stored in the collection.
 *
 * Service should look for the points which are closer to positive examples and at the same time further to negative examples. The concrete way of how to compare negative and positive distances is up to implementation in `segment` crate.
 */
export interface RecommendRequest {
  /** Look for vectors closest to those */
  positive: ExtendedPointId[];
  /**
   * Try to avoid vectors like this
   * @default []
   */
  negative?: ExtendedPointId[];
  /** Look only for points which satisfies this conditions */
  filter?: Filter;
  /** Additional search params */
  params?: SearchParams;
  /**
   * Max number of result to return
   * @format uint
   * @min 0
   */
  limit: number;
  /**
   * Offset of the first result to return. May be used to paginate results. Note: large offset values may cause performance issues.
   * @format uint
   * @min 0
   * @default 0
   */
  offset?: number;
  /** Select which payload to return with the response. Default: None */
  with_payload?: WithPayloadInterface;
  /**
   * Whether to return the point vector with the result?
   * @default null
   */
  with_vector?: WithVector;
  /**
   * Define a minimal score threshold for the result. If defined, less similar results will not be returned. Score of the returned result might be higher or smaller than the threshold depending on the Distance function used. E.g. for cosine similarity only higher scores will be returned.
   * @format float
   */
  score_threshold?: number | null;
  /**
   * Define which vector to use for recommendation, if not specified - try to use default vector
   * @default null
   */
  using?: UsingVector;
  /**
   * The location used to lookup vectors. If not specified - use current collection. Note: the other collection should have the same vector size as the current collection
   * @default null
   */
  lookup_from?: LookupLocation;
}

export type UsingVector = any;

/** Defines a location to use for looking up the vector. Specifies collection and vector field name. */
export interface LookupLocation {
  /** Name of the collection used for lookup */
  collection: string;
  /**
   * Optional name of the vector field within the collection. If not provided, the default vector field will be used.
   * @default null
   */
  vector?: string | null;
}

/** Scroll request - paginate over all points which matches given condition */
export interface ScrollRequest {
  /** Start ID to read points from. */
  offset?: ExtendedPointId;
  /**
   * Page size. Default: 10
   * @format uint
   * @min 1
   */
  limit?: number | null;
  /** Look only for points which satisfies this conditions. If not provided - all points. */
  filter?: Filter;
  /** Select which payload to return with the response. Default: All */
  with_payload?: WithPayloadInterface;
  /** Options for specifying which vector to include */
  with_vector?: WithVector;
}

/** Result of the points read request */
export interface ScrollResult {
  /** List of retrieved points */
  points: Point[];
  /** Offset which should be used to retrieve a next page result */
  next_page_offset?: ExtendedPointId;
}

/** Operation for creating new collection and (optionally) specify index params */
export interface CreateCollection {
  /**
   * Vector params separator for single and multiple vector modes Single mode:
   *
   * { "size": 128, "distance": "Cosine" }
   *
   * or multiple mode:
   *
   * { "default": { "size": 128, "distance": "Cosine" } }
   */
  vectors: VectorsConfig;
  /**
   * Number of shards in collection. Default is 1 for standalone, otherwise equal to the number of nodes Minimum is 1
   * @format uint32
   * @min 0
   * @default null
   */
  shard_number?: number | null;
  /**
   * Number of shards replicas. Default is 1 Minimum is 1
   * @format uint32
   * @min 0
   * @default null
   */
  replication_factor?: number | null;
  /**
   * Defines how many replicas should apply the operation for us to consider it successful. Increasing this number will make the collection more resilient to inconsistencies, but will also make it fail if not enough replicas are available. Does not have any performance impact.
   * @format uint32
   * @min 0
   * @default null
   */
  write_consistency_factor?: number | null;
  /**
   * If true - point's payload will not be stored in memory. It will be read from the disk every time it is requested. This setting saves RAM by (slightly) increasing the response time. Note: those payload values that are involved in filtering and are indexed - remain in RAM.
   * @default null
   */
  on_disk_payload?: boolean | null;
  /** Custom params for HNSW index. If none - values from service configuration file are used. */
  hnsw_config?: HnswConfigDiff;
  /** Custom params for WAL. If none - values from service configuration file are used. */
  wal_config?: WalConfigDiff;
  /** Custom params for Optimizers.  If none - values from service configuration file are used. */
  optimizers_config?: OptimizersConfigDiff;
  /**
   * Specify other collection to copy data from.
   * @default null
   */
  init_from?: InitFrom;
  /**
   * Quantization parameters. If none - quantization is disabled.
   * @default null
   */
  quantization_config?: QuantizationConfig;
}

export interface WalConfigDiff {
  /**
   * Size of a single WAL segment in MB
   * @format uint
   * @min 0
   */
  wal_capacity_mb?: number | null;
  /**
   * Number of WAL segments to create ahead of actually used ones
   * @format uint
   * @min 0
   */
  wal_segments_ahead?: number | null;
}

export interface OptimizersConfigDiff {
  /**
   * The minimal fraction of deleted vectors in a segment, required to perform segment optimization
   * @format double
   */
  deleted_threshold?: number | null;
  /**
   * The minimal number of vectors in a segment, required to perform segment optimization
   * @format uint
   * @min 0
   */
  vacuum_min_vector_number?: number | null;
  /**
   * Target amount of segments optimizer will try to keep. Real amount of segments may vary depending on multiple parameters: - Amount of stored points - Current write RPS
   *
   * It is recommended to select default number of segments as a factor of the number of search threads, so that each segment would be handled evenly by one of the threads If `default_segment_number = 0`, will be automatically selected by the number of available CPUs
   * @format uint
   * @min 0
   */
  default_segment_number?: number | null;
  /**
   * Do not create segments larger this size (in KiloBytes). Large segments might require disproportionately long indexation times, therefore it makes sense to limit the size of segments.
   *
   * If indexation speed have more priority for your - make this parameter lower. If search speed is more important - make this parameter higher. Note: 1Kb = 1 vector of size 256
   * @format uint
   * @min 0
   */
  max_segment_size?: number | null;
  /**
   * Maximum size (in KiloBytes) of vectors to store in-memory per segment. Segments larger than this threshold will be stored as read-only memmaped file. To enable memmap storage, lower the threshold Note: 1Kb = 1 vector of size 256
   * @format uint
   * @min 1000
   */
  memmap_threshold?: number | null;
  /**
   * Maximum size (in KiloBytes) of vectors allowed for plain index. Default value based on <https://github.com/google-research/google-research/blob/master/scann/docs/algorithms.md> Note: 1Kb = 1 vector of size 256
   * @format uint
   * @min 1000
   */
  indexing_threshold?: number | null;
  /**
   * Minimum interval between forced flushes.
   * @format uint64
   * @min 0
   */
  flush_interval_sec?: number | null;
  /**
   * Maximum available threads for optimization workers
   * @format uint
   * @min 1
   */
  max_optimization_threads?: number | null;
}

/** Operation for creating new collection and (optionally) specify index params */
export interface InitFrom {
  collection: string;
}

/** Operation for updating parameters of the existing collection */
export interface UpdateCollection {
  /** Custom params for Optimizers.  If none - values from service configuration file are used. This operation is blocking, it will only proceed ones all current optimizations are complete */
  optimizers_config?: OptimizersConfigDiff;
  /** Collection base params.  If none - values from service configuration file are used. */
  params?: CollectionParamsDiff;
}

export interface CollectionParamsDiff {
  /**
   * Number of replicas for each shard
   * @format uint32
   * @min 1
   */
  replication_factor?: number | null;
  /**
   * Minimal number successful responses from replicas to consider operation successful
   * @format uint32
   * @min 1
   */
  write_consistency_factor?: number | null;
}

/** Operation for performing changes of collection aliases. Alias changes are atomic, meaning that no collection modifications can happen between alias operations. */
export interface ChangeAliasesOperation {
  actions: AliasOperations[];
}

/** Group of all the possible operations related to collection aliases */
export type AliasOperations =
  | CreateAliasOperation
  | DeleteAliasOperation
  | RenameAliasOperation
  | (CreateAliasOperation & DeleteAliasOperation & RenameAliasOperation);

export interface CreateAliasOperation {
  /** Create alternative name for a collection. Collection will be available under both names for search, retrieve, */
  create_alias: CreateAlias;
}

/** Create alternative name for a collection. Collection will be available under both names for search, retrieve, */
export interface CreateAlias {
  collection_name: string;
  alias_name: string;
}

/** Delete alias if exists */
export interface DeleteAliasOperation {
  /** Delete alias if exists */
  delete_alias: DeleteAlias;
}

/** Delete alias if exists */
export interface DeleteAlias {
  alias_name: string;
}

/** Change alias to a new one */
export interface RenameAliasOperation {
  /** Change alias to a new one */
  rename_alias: RenameAlias;
}

/** Change alias to a new one */
export interface RenameAlias {
  old_alias_name: string;
  new_alias_name: string;
}

export interface CreateFieldIndex {
  field_name: string;
  field_schema?: PayloadFieldSchema;
}

export type PayloadFieldSchema =
  | PayloadSchemaType
  | PayloadSchemaParams
  | (PayloadSchemaType & PayloadSchemaParams);

export type PointsSelector = PointIdsList | FilterSelector | (PointIdsList & FilterSelector);

export interface PointIdsList {
  points: ExtendedPointId[];
}

export interface FilterSelector {
  filter: Filter;
}

export type PointInsertOperations = PointsBatch | PointsList;

export type BatchVectorStruct =
  | number[][]
  | Record<string, number[][]>
  | (number[][] & Record<string, number[][]>);

export interface PointStruct {
  /** Type, used for specifying point ID in user interface */
  id: ExtendedPointId;
  /** Full vector data per point separator with single and multiple vector modes */
  vector: VectorStruct;
  /** Payload values (optional) */
  payload?: Payload;
}

export interface Batch {
  ids: ExtendedPointId[];
  vectors: BatchVectorStruct;
  payloads?: Payload[] | null;
}

export interface PointsBatch {
  batch: Batch;
}

export interface PointsList {
  points: PointStruct[];
}

export interface SetPayload {
  payload: Payload;
  /** Assigns payload to each point in this list */
  points?: ExtendedPointId[] | null;
  /** Assigns payload to each point that satisfy this filter condition */
  filter?: Filter;
}

export interface DeletePayload {
  /** List of payload keys to remove from payload */
  keys: string[];
  /** Deletes values from each point in this list */
  points?: ExtendedPointId[] | null;
  /** Deletes values from points that satisfy this filter condition */
  filter?: Filter;
}

/** Information about current cluster status and structure */
export type ClusterStatus =
  | {
      status: 'disabled';
    }
  | {
      status: 'enabled';
      /**
       * ID of this peer
       * @format uint64
       * @min 0
       */
      peer_id: number;
      /** Peers composition of the cluster with main information */
      peers: Record<string, PeerInfo>;
      /** Summary information about the current raft state */
      raft_info: RaftInfo;
      /** Information about current consensus thread status */
      consensus_thread_status: ConsensusThreadStatus;
      /** Consequent failures of message send operations in consensus by peer address. On the first success to send to that peer - entry is removed from this hashmap. */
      message_send_failures: Record<string, MessageSendErrors>;
    };

/** Information of a peer in the cluster */
export interface PeerInfo {
  uri: string;
}

/** Summary information about the current raft state */
export interface RaftInfo {
  /**
   * Raft divides time into terms of arbitrary length, each beginning with an election. If a candidate wins the election, it remains the leader for the rest of the term. The term number increases monotonically. Each server stores the current term number which is also exchanged in every communication.
   * @format uint64
   * @min 0
   */
  term: number;
  /**
   * The index of the latest committed (finalized) operation that this peer is aware of.
   * @format uint64
   * @min 0
   */
  commit: number;
  /**
   * Number of consensus operations pending to be applied on this peer
   * @format uint
   * @min 0
   */
  pending_operations: number;
  /**
   * Leader of the current term
   * @format uint64
   * @min 0
   */
  leader?: number | null;
  /** Role of this peer in the current term */
  role?: StateRole;
  /** Is this peer a voter or a learner */
  is_voter: boolean;
}

/** Role of the peer in the consensus */
export enum StateRole {
  Follower = 'Follower',
  Candidate = 'Candidate',
  Leader = 'Leader',
  PreCandidate = 'PreCandidate',
}

/** Information about current consensus thread status */
export type ConsensusThreadStatus =
  | {
      consensus_thread_status: 'working';
      /** @format date-time */
      last_update: string;
    }
  | {
      consensus_thread_status: 'stopped';
    }
  | {
      consensus_thread_status: 'stopped_with_err';
      err: string;
    };

/** Message send failures for a particular peer */
export interface MessageSendErrors {
  /**
   * @format uint
   * @min 0
   */
  count: number;
  latest_error?: string | null;
}

export interface SnapshotDescription {
  name: string;
  /** @format partial-date-time */
  creation_time?: string | null;
  /**
   * @format uint64
   * @min 0
   */
  size: number;
}

/** Count Request Counts the number of points which satisfy the given filter. If filter is not provided, the count of all points in the collection will be returned. */
export interface CountRequest {
  /** Look only for points which satisfies this conditions */
  filter?: Filter;
  /**
   * If true, count exact number of points. If false, count approximate number of points faster. Approximate count might be unreliable during the indexing process. Default: true
   * @default true
   */
  exact?: boolean;
}

export interface CountResult {
  /**
   * Number of points which satisfy the conditions
   * @format uint
   * @min 0
   */
  count: number;
}

/** Current clustering distribution for the collection */
export interface CollectionClusterInfo {
  /**
   * ID of this peer
   * @format uint64
   * @min 0
   */
  peer_id: number;
  /**
   * Total number of shards
   * @format uint
   * @min 0
   */
  shard_count: number;
  /** Local shards */
  local_shards: LocalShardInfo[];
  /** Remote shards */
  remote_shards: RemoteShardInfo[];
  /** Shard transfers */
  shard_transfers: ShardTransferInfo[];
}

export interface LocalShardInfo {
  /**
   * Local shard id
   * @format uint32
   * @min 0
   */
  shard_id: number;
  /**
   * Number of points in the shard
   * @format uint
   * @min 0
   */
  points_count: number;
  /** State of the single shard within a replica set. */
  state: ReplicaState;
}

/** State of the single shard within a replica set. */
export enum ReplicaState {
  Active = 'Active',
  Dead = 'Dead',
  Partial = 'Partial',
  Initializing = 'Initializing',
  Listener = 'Listener',
}

export interface RemoteShardInfo {
  /**
   * Remote shard id
   * @format uint32
   * @min 0
   */
  shard_id: number;
  /**
   * Remote peer id
   * @format uint64
   * @min 0
   */
  peer_id: number;
  /** State of the single shard within a replica set. */
  state: ReplicaState;
}

export interface ShardTransferInfo {
  /**
   * @format uint32
   * @min 0
   */
  shard_id: number;
  /**
   * @format uint64
   * @min 0
   */
  from: number;
  /**
   * @format uint64
   * @min 0
   */
  to: number;
  /** If `true` transfer is a synchronization of a replicas If `false` transfer is a moving of a shard from one peer to another */
  sync: boolean;
}

export interface TelemetryData {
  id: string;
  app: AppBuildTelemetry;
  collections: CollectionsTelemetry;
  cluster: ClusterTelemetry;
  requests: RequestsTelemetry;
}

export interface AppBuildTelemetry {
  name: string;
  version: string;
  features?: AppFeaturesTelemetry;
  system?: RunningEnvironmentTelemetry;
  /** @format date-time */
  startup: string;
}

export interface AppFeaturesTelemetry {
  debug: boolean;
  web_feature: boolean;
  service_debug_feature: boolean;
}

export interface RunningEnvironmentTelemetry {
  distribution?: string | null;
  distribution_version?: string | null;
  is_docker: boolean;
  /**
   * @format uint
   * @min 0
   */
  cores?: number | null;
  /**
   * @format uint
   * @min 0
   */
  ram_size?: number | null;
  /**
   * @format uint
   * @min 0
   */
  disk_size?: number | null;
  cpu_flags: string;
}

export interface CollectionsTelemetry {
  /**
   * @format uint
   * @min 0
   */
  number_of_collections: number;
  collections?: CollectionTelemetryEnum[] | null;
}

export type CollectionTelemetryEnum =
  | CollectionTelemetry
  | CollectionsAggregatedTelemetry
  | (CollectionTelemetry & CollectionsAggregatedTelemetry);

export interface CollectionTelemetry {
  id: string;
  /**
   * @format uint64
   * @min 0
   */
  init_time_ms: number;
  config: CollectionConfig;
  shards: ReplicaSetTelemetry[];
  transfers: ShardTransferInfo[];
}

export interface ReplicaSetTelemetry {
  /**
   * @format uint32
   * @min 0
   */
  id: number;
  local?: LocalShardTelemetry;
  remote: RemoteShardTelemetry[];
  replicate_states: Record<string, ReplicaState>;
}

export interface LocalShardTelemetry {
  variant_name?: string | null;
  segments: SegmentTelemetry[];
  optimizations: OptimizerTelemetry;
}

export interface SegmentTelemetry {
  /** Aggregated information about segment */
  info: SegmentInfo;
  config: SegmentConfig;
  vector_index_searches: VectorIndexSearchesTelemetry[];
  payload_field_indices: PayloadIndexTelemetry[];
}

/** Aggregated information about segment */
export interface SegmentInfo {
  /** Type of segment */
  segment_type: SegmentType;
  /**
   * @format uint
   * @min 0
   */
  num_vectors: number;
  /**
   * @format uint
   * @min 0
   */
  num_points: number;
  /**
   * @format uint
   * @min 0
   */
  num_deleted_vectors: number;
  /**
   * @format uint
   * @min 0
   */
  ram_usage_bytes: number;
  /**
   * @format uint
   * @min 0
   */
  disk_usage_bytes: number;
  is_appendable: boolean;
  index_schema: Record<string, PayloadIndexInfo>;
}

/** Type of segment */
export enum SegmentType {
  Plain = 'plain',
  Indexed = 'indexed',
  Special = 'special',
}

export interface SegmentConfig {
  vector_data: Record<string, VectorDataConfig>;
  /** Vector index configuration of the segment */
  index: Indexes;
  /** Type of vector storage */
  storage_type: StorageType;
  /** Type of payload storage */
  payload_storage_type?: PayloadStorageType;
  /**
   * Quantization parameters. If none - quantization is disabled.
   * @default null
   */
  quantization_config?: QuantizationConfig;
}

/** Config of single vector data storage */
export interface VectorDataConfig {
  /**
   * Size of a vectors used
   * @format uint
   * @min 0
   */
  size: number;
  /** Type of internal tags, build from payload Distance function types used to compare vectors */
  distance: Distance;
  /**
   * Vector specific HNSW config that overrides collection config
   * @default null
   */
  hnsw_config?: HnswConfig;
  /**
   * Vector specific quantization config that overrides collection config
   * @default null
   */
  quantization_config?: QuantizationConfig;
}

/** Vector index configuration of the segment */
export type Indexes =
  | {
      type: 'plain';
      options: object;
    }
  | {
      type: 'hnsw';
      /** Config of HNSW index */
      options: HnswConfig;
    };

/** Type of vector storage */
export type StorageType =
  | {
      type: 'in_memory';
    }
  | {
      type: 'mmap';
    };

/** Type of payload storage */
export type PayloadStorageType =
  | {
      type: 'in_memory';
    }
  | {
      type: 'on_disk';
    };

export interface VectorIndexSearchesTelemetry {
  index_name?: string | null;
  unfiltered_plain: OperationDurationStatistics;
  unfiltered_hnsw: OperationDurationStatistics;
  filtered_plain: OperationDurationStatistics;
  filtered_small_cardinality: OperationDurationStatistics;
  filtered_large_cardinality: OperationDurationStatistics;
  filtered_exact: OperationDurationStatistics;
  unfiltered_exact: OperationDurationStatistics;
}

export interface OperationDurationStatistics {
  /**
   * @format uint
   * @min 0
   */
  count: number;
  /**
   * @format uint
   * @min 0
   */
  fail_count?: number;
  /** @format float */
  avg_duration_micros?: number | null;
  /** @format float */
  min_duration_micros?: number | null;
  /** @format float */
  max_duration_micros?: number | null;
  /** @format date-time */
  last_responded?: string | null;
}

export interface PayloadIndexTelemetry {
  field_name?: string | null;
  /**
   * @format uint
   * @min 0
   */
  points_values_count: number;
  /**
   * @format uint
   * @min 0
   */
  points_count: number;
  /**
   * @format uint
   * @min 0
   */
  histogram_bucket_size?: number | null;
}

export interface OptimizerTelemetry {
  /** Current state of the collection */
  status: OptimizersStatus;
  optimizations: OperationDurationStatistics;
}

export interface RemoteShardTelemetry {
  /**
   * @format uint32
   * @min 0
   */
  shard_id: number;
  /**
   * @format uint64
   * @min 0
   */
  peer_id?: number | null;
  searches: OperationDurationStatistics;
  updates: OperationDurationStatistics;
}

export interface CollectionsAggregatedTelemetry {
  /**
   * @format uint
   * @min 0
   */
  vectors: number;
  /** Current state of the collection */
  optimizers_status: OptimizersStatus;
  params: CollectionParams;
}

export interface ClusterTelemetry {
  enabled: boolean;
  status?: ClusterStatusTelemetry;
  config?: ClusterConfigTelemetry;
}

export interface ClusterStatusTelemetry {
  /**
   * @format uint
   * @min 0
   */
  number_of_peers: number;
  /**
   * @format uint64
   * @min 0
   */
  term: number;
  /**
   * @format uint64
   * @min 0
   */
  commit: number;
  /**
   * @format uint
   * @min 0
   */
  pending_operations: number;
  role?: StateRole;
  is_voter: boolean;
  /**
   * @format uint64
   * @min 0
   */
  peer_id?: number | null;
  /** Information about current consensus thread status */
  consensus_thread_status: ConsensusThreadStatus;
}

export interface ClusterConfigTelemetry {
  /**
   * @format uint64
   * @min 0
   */
  grpc_timeout_ms: number;
  p2p: P2PConfigTelemetry;
  consensus: ConsensusConfigTelemetry;
}

export interface P2PConfigTelemetry {
  /**
   * @format uint
   * @min 0
   */
  connection_pool_size: number;
}

export interface ConsensusConfigTelemetry {
  /**
   * @format uint
   * @min 0
   */
  max_message_queue_size: number;
  /**
   * @format uint64
   * @min 0
   */
  tick_period_ms: number;
  /**
   * @format uint64
   * @min 0
   */
  bootstrap_timeout_sec: number;
}

export interface RequestsTelemetry {
  rest: WebApiTelemetry;
  grpc: GrpcTelemetry;
}

export interface WebApiTelemetry {
  responses: Record<string, Record<string, OperationDurationStatistics>>;
}

export interface GrpcTelemetry {
  responses: Record<string, OperationDurationStatistics>;
}

export type ClusterOperations =
  | MoveShardOperation
  | ReplicateShardOperation
  | AbortTransferOperation
  | DropReplicaOperation
  | (MoveShardOperation & ReplicateShardOperation & AbortTransferOperation & DropReplicaOperation);

export interface MoveShardOperation {
  move_shard: MoveShard;
}

export interface MoveShard {
  /**
   * @format uint32
   * @min 0
   */
  shard_id: number;
  /**
   * @format uint64
   * @min 0
   */
  to_peer_id: number;
  /**
   * @format uint64
   * @min 0
   */
  from_peer_id: number;
}

export interface ReplicateShardOperation {
  replicate_shard: MoveShard;
}

export interface AbortTransferOperation {
  abort_transfer: MoveShard;
}

export interface DropReplicaOperation {
  drop_replica: Replica;
}

export interface Replica {
  /**
   * @format uint32
   * @min 0
   */
  shard_id: number;
  /**
   * @format uint64
   * @min 0
   */
  peer_id: number;
}

export interface SearchRequestBatch {
  searches: SearchRequest[];
}

export interface RecommendRequestBatch {
  searches: RecommendRequest[];
}

export interface LocksOption {
  error_message?: string | null;
  write: boolean;
}

export interface SnapshotRecover {
  /**
   * Examples: - URL `http://localhost:8080/collections/my_collection/snapshots/my_snapshot` - Local path `file:///qdrant/snapshots/test_collection-2022-08-04-10-49-10.snapshot`
   * @format uri
   */
  location: string;
  /**
   * Defines which data should be used as a source of truth if there are other replicas in the cluster. If set to `Snapshot`, the snapshot will be used as a source of truth, and the current state will be overwritten. If set to `Replica`, the current state will be used as a source of truth, and after recovery if will be synchronized with the snapshot.
   * @default null
   */
  priority?: SnapshotPriority;
}

/** Defines source of truth for snapshot recovery `Snapshot` means - prefer snapshot data over the current state `Replica` means - prefer existing data over the snapshot */
export enum SnapshotPriority {
  Snapshot = 'snapshot',
  Replica = 'replica',
}

export interface CollectionsAliasesResponse {
  aliases: AliasDescription[];
}

export interface AliasDescription {
  alias_name: string;
  collection_name: string;
}

/**
 * Defines write ordering guarantees for collection operations
 *
 * * `weak` - write operations may be reordered, works faster, default
 *
 * * `medium` - write operations go through dynamically selected leader, may be inconsistent for a short period of time in case of leader change
 *
 * * `strong` - Write operations go through the permanent leader, consistent, but may be unavailable if leader is down
 */
export enum WriteOrdering {
  Weak = 'weak',
  Medium = 'medium',
  Strong = 'strong',
}

/**
 * Read consistency parameter
 *
 * Defines how many replicas should be queried to get the result
 *
 * * `N` - send N random request and return points, which present on all of them
 *
 * * `majority` - send N/2+1 random request and return points, which present on all of them
 *
 * * `quorum` - send requests to all nodes and return points which present on majority of them
 *
 * * `all` - send requests to all nodes and return points which present on all of them
 *
 * Default value is `Factor(1)`
 */
export type ReadConsistency = ReadConsistencyType;

/**
 * * `majority` - send N/2+1 random request and return points, which present on all of them
 *
 * * `quorum` - send requests to all nodes and return points which present on majority of nodes
 *
 * * `all` - send requests to all nodes and return points which present on all nodes
 */
export enum ReadConsistencyType {
  Majority = 'majority',
  Quorum = 'quorum',
  All = 'all',
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '{protocol}://{hostname}:{port}';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(key => 'undefined' !== typeof query[key]);
    return keys
      .map(key =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        },
        signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
        body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
      },
    ).then(async response => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then(data => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch(e => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Qdrant API
 * @version master
 * @license Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0.html)
 * @baseUrl {protocol}://{hostname}:{port}
 * @externalDocs https://qdrant.tech/documentation/
 * @contact <andrey@vasnetsov.com>
 *
 * API description for Qdrant vector search engine.
 *
 * This document describes CRUD and search operations on collections of points (vectors with payload).
 *
 * Qdrant supports any combinations of `should`, `must` and `must_not` conditions, which makes it possible to use in applications when object could not be described solely by vector. It could be location features, availability flags, and other custom properties businesses should take into account.
 * ## Examples
 * This examples cover the most basic use-cases - collection creation and basic vector search.
 * ### Create collection
 * First - let's create a collection with dot-production metric.
 * ```
 * curl -X PUT 'http://localhost:6333/collections/test_collection' \
 *   -H 'Content-Type: application/json' \
 *   --data-raw '{
 *     "vectors": {
 *       "size": 4,
 *       "distance": "Dot"
 *     }
 *   }'
 *
 * ```
 * Expected response:
 * ```
 * {
 *     "result": true,
 *     "status": "ok",
 *     "time": 0.031095451
 * }
 * ```
 * We can ensure that collection was created:
 * ```
 * curl 'http://localhost:6333/collections/test_collection'
 * ```
 * Expected response:
 * ```
 * {
 *   "result": {
 *     "status": "green",
 *     "vectors_count": 0,
 *     "segments_count": 5,
 *     "disk_data_size": 0,
 *     "ram_data_size": 0,
 *     "config": {
 *       "params": {
 *         "vectors": {
 *           "size": 4,
 *           "distance": "Dot"
 *         }
 *       },
 *       "hnsw_config": {
 *         "m": 16,
 *         "ef_construct": 100,
 *         "full_scan_threshold": 10000
 *       },
 *       "optimizer_config": {
 *         "deleted_threshold": 0.2,
 *         "vacuum_min_vector_number": 1000,
 *         "max_segment_number": 5,
 *         "memmap_threshold": 50000,
 *         "indexing_threshold": 20000,
 *         "flush_interval_sec": 1
 *       },
 *       "wal_config": {
 *         "wal_capacity_mb": 32,
 *         "wal_segments_ahead": 0
 *       }
 *     }
 *   },
 *   "status": "ok",
 *   "time": 2.1199e-05
 * }
 * ```
 *
 * ### Add points
 * Let's now add vectors with some payload:
 * ```
 * curl -L -X PUT 'http://localhost:6333/collections/test_collection/points?wait=true' \ -H 'Content-Type: application/json' \ --data-raw '{
 *   "points": [
 *     {"id": 1, "vector": [0.05, 0.61, 0.76, 0.74], "payload": {"city": "Berlin"}},
 *     {"id": 2, "vector": [0.19, 0.81, 0.75, 0.11], "payload": {"city": ["Berlin", "London"] }},
 *     {"id": 3, "vector": [0.36, 0.55, 0.47, 0.94], "payload": {"city": ["Berlin", "Moscow"] }},
 *     {"id": 4, "vector": [0.18, 0.01, 0.85, 0.80], "payload": {"city": ["London", "Moscow"] }},
 *     {"id": 5, "vector": [0.24, 0.18, 0.22, 0.44], "payload": {"count": [0]}},
 *     {"id": 6, "vector": [0.35, 0.08, 0.11, 0.44]}
 *   ]
 * }'
 * ```
 * Expected response:
 * ```
 * {
 *     "result": {
 *         "operation_id": 0,
 *         "status": "completed"
 *     },
 *     "status": "ok",
 *     "time": 0.000206061
 * }
 * ```
 * ### Search with filtering
 * Let's start with a basic request:
 * ```
 * curl -L -X POST 'http://localhost:6333/collections/test_collection/points/search' \ -H 'Content-Type: application/json' \ --data-raw '{
 *     "vector": [0.2,0.1,0.9,0.7],
 *     "top": 3
 * }'
 * ```
 * Expected response:
 * ```
 * {
 *     "result": [
 *         { "id": 4, "score": 1.362, "payload": null, "version": 0 },
 *         { "id": 1, "score": 1.273, "payload": null, "version": 0 },
 *         { "id": 3, "score": 1.208, "payload": null, "version": 0 }
 *     ],
 *     "status": "ok",
 *     "time": 0.000055785
 * }
 * ```
 * But result is different if we add a filter:
 * ```
 * curl -L -X POST 'http://localhost:6333/collections/test_collection/points/search' \ -H 'Content-Type: application/json' \ --data-raw '{
 *     "filter": {
 *         "should": [
 *             {
 *                 "key": "city",
 *                 "match": {
 *                     "value": "London"
 *                 }
 *             }
 *         ]
 *     },
 *     "vector": [0.2, 0.1, 0.9, 0.7],
 *     "top": 3
 * }'
 * ```
 * Expected response:
 * ```
 * {
 *     "result": [
 *         { "id": 4, "score": 1.362, "payload": null, "version": 0 },
 *         { "id": 2, "score": 0.871, "payload": null, "version": 0 }
 *     ],
 *     "status": "ok",
 *     "time": 0.000093972
 * }
 * ```
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  telemetry = {
    /**
     * @description Collect telemetry data including app info, system info, collections info, cluster info, configs and statistics
     *
     * @tags service
     * @name Telemetry
     * @summary Collect telemetry data
     * @request GET:/telemetry
     */
    telemetry: (
      query?: {
        /** If true, anonymize result */
        anonymize?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: TelemetryData;
        },
        ErrorResponse
      >({
        path: `/telemetry`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  };
  metrics = {
    /**
     * @description Collect metrics data including app info, collections info, cluster info and statistics
     *
     * @tags service
     * @name Metrics
     * @summary Collect Prometheus metrics data
     * @request GET:/metrics
     */
    metrics: (
      query?: {
        /** If true, anonymize result */
        anonymize?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, void>({
        path: `/metrics`,
        method: 'GET',
        query: query,
        ...params,
      }),
  };
  locks = {
    /**
     * @description Set lock options. If write is locked, all write operations and collection creation are forbidden. Returns previous lock options
     *
     * @tags service
     * @name PostLocks
     * @summary Set lock options
     * @request POST:/locks
     */
    postLocks: (data: LocksOption, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: LocksOption;
        },
        ErrorResponse
      >({
        path: `/locks`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get lock options. If write is locked, all write operations and collection creation are forbidden
     *
     * @tags service
     * @name GetLocks
     * @summary Get lock options
     * @request GET:/locks
     */
    getLocks: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: LocksOption;
        },
        ErrorResponse
      >({
        path: `/locks`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  cluster = {
    /**
     * @description Get information about the current state and composition of the cluster
     *
     * @tags cluster
     * @name ClusterStatus
     * @summary Get cluster status info
     * @request GET:/cluster
     */
    clusterStatus: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          /** Information about current cluster status and structure */
          result?: ClusterStatus;
        },
        ErrorResponse
      >({
        path: `/cluster`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags cluster
     * @name RecoverCurrentPeer
     * @summary Tries to recover current peer Raft state.
     * @request POST:/cluster/recover
     */
    recoverCurrentPeer: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: boolean;
        },
        ErrorResponse
      >({
        path: `/cluster/recover`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * @description Tries to remove peer from the cluster. Will return an error if peer has shards on it.
     *
     * @tags cluster
     * @name RemovePeer
     * @summary Remove peer from the cluster
     * @request DELETE:/cluster/peer/{peer_id}
     */
    removePeer: (
      peerId: number,
      query?: {
        /**
         * If true - removes peer even if it has shards/replicas on it.
         * @default false
         */
        force?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: boolean;
        },
        ErrorResponse
      >({
        path: `/cluster/peer/${peerId}`,
        method: 'DELETE',
        query: query,
        format: 'json',
        ...params,
      }),
  };
  collections = {
    /**
     * @description Get list name of all existing collections
     *
     * @tags collections
     * @name GetCollections
     * @summary List collections
     * @request GET:/collections
     */
    getCollections: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: CollectionsResponse;
        },
        ErrorResponse
      >({
        path: `/collections`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Get detailed information about specified existing collection
     *
     * @tags collections
     * @name GetCollection
     * @summary Collection info
     * @request GET:/collections/{collection_name}
     */
    getCollection: (collectionName: string, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          /** Current statistics and configuration of the collection */
          result?: CollectionInfo;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Create new collection with given parameters
     *
     * @tags collections
     * @name CreateCollection
     * @summary Create collection
     * @request PUT:/collections/{collection_name}
     */
    createCollection: (
      collectionName: string,
      data: CreateCollection,
      query?: {
        /**
         * Wait for operation commit timeout in seconds.
         * If timeout is reached - request will return with service error.
         */
        timeout?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: boolean;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}`,
        method: 'PUT',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Update parameters of the existing collection
     *
     * @tags collections
     * @name UpdateCollection
     * @summary Update collection parameters
     * @request PATCH:/collections/{collection_name}
     */
    updateCollection: (
      collectionName: string,
      data: UpdateCollection,
      query?: {
        /**
         * Wait for operation commit timeout in seconds.
         * If timeout is reached - request will return with service error.
         */
        timeout?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: boolean;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}`,
        method: 'PATCH',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Drop collection and all associated data
     *
     * @tags collections
     * @name DeleteCollection
     * @summary Delete collection
     * @request DELETE:/collections/{collection_name}
     */
    deleteCollection: (
      collectionName: string,
      query?: {
        /**
         * Wait for operation commit timeout in seconds.
         * If timeout is reached - request will return with service error.
         */
        timeout?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: boolean;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}`,
        method: 'DELETE',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags collections
     * @name UpdateAliases
     * @summary Update aliases of the collections
     * @request POST:/collections/aliases
     */
    updateAliases: (
      data: ChangeAliasesOperation,
      query?: {
        /**
         * Wait for operation commit timeout in seconds.
         * If timeout is reached - request will return with service error.
         */
        timeout?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: boolean;
        },
        ErrorResponse
      >({
        path: `/collections/aliases`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Create index for field in collection
     *
     * @tags collections
     * @name CreateFieldIndex
     * @summary Create index for field in collection
     * @request PUT:/collections/{collection_name}/index
     */
    createFieldIndex: (
      collectionName: string,
      data: CreateFieldIndex,
      query?: {
        /** If true, wait for changes to actually happen */
        wait?: boolean;
        /** define ordering guarantees for the operation */
        ordering?: WriteOrdering;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: UpdateResult;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/index`,
        method: 'PUT',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Delete field index for collection
     *
     * @tags collections
     * @name DeleteFieldIndex
     * @summary Delete index for field in collection
     * @request DELETE:/collections/{collection_name}/index/{field_name}
     */
    deleteFieldIndex: (
      collectionName: string,
      fieldName: string,
      query?: {
        /** If true, wait for changes to actually happen */
        wait?: boolean;
        /** define ordering guarantees for the operation */
        ordering?: WriteOrdering;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: UpdateResult;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/index/${fieldName}`,
        method: 'DELETE',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get cluster information for a collection
     *
     * @tags collections, cluster
     * @name CollectionClusterInfo
     * @summary Collection cluster info
     * @request GET:/collections/{collection_name}/cluster
     */
    collectionClusterInfo: (collectionName: string, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          /** Current clustering distribution for the collection */
          result?: CollectionClusterInfo;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/cluster`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags collections, cluster
     * @name UpdateCollectionCluster
     * @summary Update collection cluster setup
     * @request POST:/collections/{collection_name}/cluster
     */
    updateCollectionCluster: (
      collectionName: string,
      data: ClusterOperations,
      query?: {
        /**
         * Wait for operation commit timeout in seconds.
         * If timeout is reached - request will return with service error.
         */
        timeout?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: boolean;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/cluster`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get list of all aliases for a collection
     *
     * @tags collections
     * @name GetCollectionAliases
     * @summary List aliases for collection
     * @request GET:/collections/{collection_name}/aliases
     */
    getCollectionAliases: (collectionName: string, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: CollectionsAliasesResponse;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/aliases`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Recover local collection data from an uploaded snapshot. This will overwrite any data, stored on this node, for the collection. If collection does not exist - it will be created.
     *
     * @tags snapshots, collections
     * @name RecoverFromUploadedSnapshot
     * @summary Recover from an uploaded snapshot
     * @request POST:/collections/{collection_name}/snapshots/upload
     */
    recoverFromUploadedSnapshot: (
      collectionName: string,
      data: {
        /** @format binary */
        snapshot?: File;
      },
      query?: {
        /** If true, wait for changes to actually happen. If false - let changes happen in background. Default is true. */
        wait?: boolean;
        /** Defines source of truth for snapshot recovery */
        priority?: SnapshotPriority;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: boolean;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/snapshots/upload`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Recover local collection data from a snapshot. This will overwrite any data, stored on this node, for the collection. If collection does not exist - it will be created.
     *
     * @tags snapshots, collections
     * @name RecoverFromSnapshot
     * @summary Recover from a snapshot
     * @request PUT:/collections/{collection_name}/snapshots/recover
     */
    recoverFromSnapshot: (
      collectionName: string,
      data: SnapshotRecover,
      query?: {
        /** If true, wait for changes to actually happen. If false - let changes happen in background. Default is true. */
        wait?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: boolean;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/snapshots/recover`,
        method: 'PUT',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get list of snapshots for a collection
     *
     * @tags snapshots, collections
     * @name ListSnapshots
     * @summary List collection snapshots
     * @request GET:/collections/{collection_name}/snapshots
     */
    listSnapshots: (collectionName: string, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: SnapshotDescription[];
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/snapshots`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Create new snapshot for a collection
     *
     * @tags snapshots, collections
     * @name CreateSnapshot
     * @summary Create collection snapshot
     * @request POST:/collections/{collection_name}/snapshots
     */
    createSnapshot: (
      collectionName: string,
      query?: {
        /** If true, wait for changes to actually happen. If false - let changes happen in background. Default is true. */
        wait?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: SnapshotDescription;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/snapshots`,
        method: 'POST',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Delete snapshot for a collection
     *
     * @tags snapshots, collections
     * @name DeleteSnapshot
     * @summary Delete collection snapshot
     * @request DELETE:/collections/{collection_name}/snapshots/{snapshot_name}
     */
    deleteSnapshot: (
      collectionName: string,
      snapshotName: string,
      query?: {
        /** If true, wait for changes to actually happen. If false - let changes happen in background. Default is true. */
        wait?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: boolean;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/snapshots/${snapshotName}`,
        method: 'DELETE',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Download specified snapshot from a collection as a file
     *
     * @tags snapshots, collections
     * @name GetSnapshot
     * @summary Download collection snapshot
     * @request GET:/collections/{collection_name}/snapshots/{snapshot_name}
     */
    getSnapshot: (collectionName: string, snapshotName: string, params: RequestParams = {}) =>
      this.request<File, ErrorResponse>({
        path: `/collections/${collectionName}/snapshots/${snapshotName}`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description Retrieve full information of single point by id
     *
     * @tags points
     * @name GetPoint
     * @summary Get point
     * @request GET:/collections/{collection_name}/points/{id}
     */
    getPoint: (
      collectionName: string,
      id: ExtendedPointId,
      query?: {
        /** Define read consistency guarantees for the operation */
        consistency?: ReadConsistency;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          /** Point data */
          result?: Point;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/${id}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieve multiple points by specified IDs
     *
     * @tags points
     * @name GetPoints
     * @summary Get points
     * @request POST:/collections/{collection_name}/points
     */
    getPoints: (
      collectionName: string,
      data: PointRequest,
      query?: {
        /** Define read consistency guarantees for the operation */
        consistency?: ReadConsistency;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: Point[];
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Perform insert + updates on points. If point with given ID already exists - it will be overwritten.
     *
     * @tags points
     * @name UpsertPoints
     * @summary Upsert points
     * @request PUT:/collections/{collection_name}/points
     */
    upsertPoints: (
      collectionName: string,
      data: PointInsertOperations,
      query?: {
        /** If true, wait for changes to actually happen */
        wait?: boolean;
        /** define ordering guarantees for the operation */
        ordering?: WriteOrdering;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: UpdateResult;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points`,
        method: 'PUT',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Delete points
     *
     * @tags points
     * @name DeletePoints
     * @summary Delete points
     * @request POST:/collections/{collection_name}/points/delete
     */
    deletePoints: (
      collectionName: string,
      data: PointsSelector,
      query?: {
        /** If true, wait for changes to actually happen */
        wait?: boolean;
        /** define ordering guarantees for the operation */
        ordering?: WriteOrdering;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: UpdateResult;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/delete`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Set payload values for points
     *
     * @tags points
     * @name SetPayload
     * @summary Set payload
     * @request POST:/collections/{collection_name}/points/payload
     */
    setPayload: (
      collectionName: string,
      data: SetPayload,
      query?: {
        /** If true, wait for changes to actually happen */
        wait?: boolean;
        /** define ordering guarantees for the operation */
        ordering?: WriteOrdering;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: UpdateResult;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/payload`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Replace full payload of points with new one
     *
     * @tags points
     * @name OverwritePayload
     * @summary Overwrite payload
     * @request PUT:/collections/{collection_name}/points/payload
     */
    overwritePayload: (
      collectionName: string,
      data: SetPayload,
      query?: {
        /** If true, wait for changes to actually happen */
        wait?: boolean;
        /** define ordering guarantees for the operation */
        ordering?: WriteOrdering;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: UpdateResult;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/payload`,
        method: 'PUT',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Delete specified key payload for points
     *
     * @tags points
     * @name DeletePayload
     * @summary Delete payload
     * @request POST:/collections/{collection_name}/points/payload/delete
     */
    deletePayload: (
      collectionName: string,
      data: DeletePayload,
      query?: {
        /** If true, wait for changes to actually happen */
        wait?: boolean;
        /** define ordering guarantees for the operation */
        ordering?: WriteOrdering;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: UpdateResult;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/payload/delete`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Remove all payload for specified points
     *
     * @tags points
     * @name ClearPayload
     * @summary Clear payload
     * @request POST:/collections/{collection_name}/points/payload/clear
     */
    clearPayload: (
      collectionName: string,
      data: PointsSelector,
      query?: {
        /** If true, wait for changes to actually happen */
        wait?: boolean;
        /** define ordering guarantees for the operation */
        ordering?: WriteOrdering;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: UpdateResult;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/payload/clear`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Scroll request - paginate over all points which matches given filtering condition
     *
     * @tags points
     * @name ScrollPoints
     * @summary Scroll points
     * @request POST:/collections/{collection_name}/points/scroll
     */
    scrollPoints: (
      collectionName: string,
      data: ScrollRequest,
      query?: {
        /** Define read consistency guarantees for the operation */
        consistency?: ReadConsistency;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          /** Result of the points read request */
          result?: ScrollResult;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/scroll`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieve closest points based on vector similarity and given filtering conditions
     *
     * @tags points
     * @name SearchPoints
     * @summary Search points
     * @request POST:/collections/{collection_name}/points/search
     */
    searchPoints: (
      collectionName: string,
      data: SearchRequest,
      query?: {
        /** Define read consistency guarantees for the operation */
        consistency?: ReadConsistency;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: ScoredPoint[];
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/search`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieve by batch the closest points based on vector similarity and given filtering conditions
     *
     * @tags points
     * @name SearchBatchPoints
     * @summary Search batch points
     * @request POST:/collections/{collection_name}/points/search/batch
     */
    searchBatchPoints: (
      collectionName: string,
      data: SearchRequestBatch,
      query?: {
        /** Define read consistency guarantees for the operation */
        consistency?: ReadConsistency;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: ScoredPoint[][];
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/search/batch`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Look for the points which are closer to stored positive examples and at the same time further to negative examples.
     *
     * @tags points
     * @name RecommendPoints
     * @summary Recommend points
     * @request POST:/collections/{collection_name}/points/recommend
     */
    recommendPoints: (
      collectionName: string,
      data: RecommendRequest,
      query?: {
        /** Define read consistency guarantees for the operation */
        consistency?: ReadConsistency;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: ScoredPoint[];
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/recommend`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Look for the points which are closer to stored positive examples and at the same time further to negative examples.
     *
     * @tags points
     * @name RecommendBatchPoints
     * @summary Recommend batch points
     * @request POST:/collections/{collection_name}/points/recommend/batch
     */
    recommendBatchPoints: (
      collectionName: string,
      data: RecommendRequestBatch,
      query?: {
        /** Define read consistency guarantees for the operation */
        consistency?: ReadConsistency;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: ScoredPoint[][];
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/recommend/batch`,
        method: 'POST',
        query: query,
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Count points which matches given filtering condition
     *
     * @tags points
     * @name CountPoints
     * @summary Count points
     * @request POST:/collections/{collection_name}/points/count
     */
    countPoints: (collectionName: string, data: CountRequest, params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: CountResult;
        },
        ErrorResponse
      >({
        path: `/collections/${collectionName}/points/count`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  aliases = {
    /**
     * @description Get list of all existing collections aliases
     *
     * @tags collections
     * @name GetCollectionsAliases
     * @summary List collections aliases
     * @request GET:/aliases
     */
    getCollectionsAliases: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: CollectionsAliasesResponse;
        },
        ErrorResponse
      >({
        path: `/aliases`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  snapshots = {
    /**
     * @description Get list of snapshots of the whole storage
     *
     * @tags snapshots
     * @name ListFullSnapshots
     * @summary List of storage snapshots
     * @request GET:/snapshots
     */
    listFullSnapshots: (params: RequestParams = {}) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: SnapshotDescription[];
        },
        ErrorResponse
      >({
        path: `/snapshots`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Create new snapshot of the whole storage
     *
     * @tags snapshots
     * @name CreateFullSnapshot
     * @summary Create storage snapshot
     * @request POST:/snapshots
     */
    createFullSnapshot: (
      query?: {
        /** If true, wait for changes to actually happen. If false - let changes happen in background. Default is true. */
        wait?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: SnapshotDescription;
        },
        ErrorResponse
      >({
        path: `/snapshots`,
        method: 'POST',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Delete snapshot of the whole storage
     *
     * @tags snapshots
     * @name DeleteFullSnapshot
     * @summary Delete storage snapshot
     * @request DELETE:/snapshots/{snapshot_name}
     */
    deleteFullSnapshot: (
      snapshotName: string,
      query?: {
        /** If true, wait for changes to actually happen. If false - let changes happen in background. Default is true. */
        wait?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /**
           * Time spent to process this request
           * @format float
           */
          time?: number;
          status?: 'ok';
          result?: boolean;
        },
        ErrorResponse
      >({
        path: `/snapshots/${snapshotName}`,
        method: 'DELETE',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Download specified snapshot of the whole storage as a file
     *
     * @tags snapshots
     * @name GetFullSnapshot
     * @summary Download storage snapshot
     * @request GET:/snapshots/{snapshot_name}
     */
    getFullSnapshot: (snapshotName: string, params: RequestParams = {}) =>
      this.request<File, ErrorResponse>({
        path: `/snapshots/${snapshotName}`,
        method: 'GET',
        ...params,
      }),
  };
}
