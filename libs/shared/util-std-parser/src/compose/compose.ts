import { isFailure, isOk } from '@brandingbrand/standard-result';

import type { Parser, ParserFailureFields, ParserOkFields, ParserResult } from '../parser';
import { parseOk } from '../parser';

export const mapParse =
  <OutputType, InputType>(callback: (value: InputType) => OutputType) =>
  (result: ParserResult<InputType>): ParserResult<OutputType> => {
    if (isOk(result)) {
      const updatedResult = callback(result.ok.value);
      return parseOk({ ...result.ok, value: updatedResult });
    }

    return result;
  };

export const mapParseFailure =
  <OutputType>(callback: (value: ParserFailureFields) => OutputType) =>
  <InputType>(result: ParserResult<InputType>): ParserResult<InputType | OutputType> => {
    if (isFailure(result)) {
      const updatedResult = callback(result.failure);
      return parseOk({ ...result.failure, cursorEnd: result.failure.cursor, value: updatedResult });
    }

    return result;
  };

export const flatMapParse =
  <OutputType, InputType>(parser: (args: ParserOkFields<InputType>) => ParserResult<OutputType>) =>
  <InnerInputType extends InputType>(result: ParserResult<InnerInputType>) => {
    if (isOk(result)) {
      return parser({ ...result.ok, cursor: result.ok.cursorEnd });
    }

    return result;
  };

export const flatMapParseFailure =
  <OutputType>(parser: Parser<OutputType>) =>
  <InputType>(result: ParserResult<InputType>) => {
    if (isFailure(result)) {
      return parser(result.failure);
    }

    return result;
  };

export const mergeParse =
  <OutputType>(parser: Parser<OutputType>) =>
  <InputType>(result: ParserResult<InputType>): ParserResult<[InputType, OutputType]> => {
    if (isOk(result)) {
      const nextResult = parser({ ...result.ok, cursor: result.ok.cursorEnd });
      if (isOk(nextResult)) {
        return parseOk({
          ...nextResult.ok,
          cursor: result.ok.cursor,
          value: [result.ok.value, nextResult.ok.value],
        });
      }

      return nextResult;
    }

    return result;
  };
