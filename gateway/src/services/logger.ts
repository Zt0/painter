import * as bunyan from 'bunyan'
import { LoggingBunyan } from '@google-cloud/logging-bunyan';
import { ConfigService } from './config/config.service';

export enum LogType {
  SystemLog = 'SystemLog',
}

type RequestContext = {
  authUserID: string
  deviceID: string
  requestID: string
  ipAddress: string
}

type LoggerContext<T> = {
  logType: LogType
  requestContext: RequestContext
  eventName: string
  functionName: string
  message?: string
  additionalMetaData: T
}

const loggerPayload = <T>(
  context: {functionName: string; eventName: string; logType?: LogType},
  data: {message?: string} & T,
): LoggerContext<T> => {
  const {functionName, eventName, logType} = context

  return {
    logType: logType ?? LogType.SystemLog,
    requestContext: null,
    eventName,
    functionName,
    message: data?.message,
    additionalMetaData: data,
  }
}

type ActivityLogPayload<T> = {
  logType: LogType
  requestContext: {
    authUserID: string
    deviceID: string
    requestID: string
    ipAddress: string
  }
  endpoint: string
  additionalMetaData?: T
}

export class StructuredLogger {
  private static logger: bunyan = null

  private static initLogger(sourceName: string): bunyan {
    const logStreams = []

    const loggingBunyan = new LoggingBunyan({
      projectId: 'black-resource-347917',
    })
    logStreams.push(loggingBunyan.stream('info'))
    logStreams.push({stream: process.stdout, level: 'info'})
    return bunyan.createLogger({name: sourceName, streams: logStreams, serializers: bunyan.stdSerializers})
  }

  static requestContext: RequestContext
  // eslint-disable-next-line max-params
  static info(
    functionName: string,
    eventName: string,
    data: unknown,
    logType?: LogType,
  ): void {
    StructuredLogger.logger.info(loggerPayload({functionName, eventName, logType}, data))
  } 

  // eslint-disable-next-line max-params
  static warn(
    functionName: string,
    eventName: string,
    data: { message: string },
    logType?: LogType,
  ): void {
    StructuredLogger.logger.warn(loggerPayload({functionName, eventName, logType}, data))
  }

  static debug(functionName: string, eventName: string, data: {message: string}): void {
    StructuredLogger.logger.debug(loggerPayload({functionName, eventName}, data))
  }

  // eslint-disable-next-line max-params
  static error(
    functionName: string,
    eventName: string,
    data: { message: string, email?: string },
    logType?: LogType,
  ): void {
    StructuredLogger.logger.error(loggerPayload({functionName, eventName, logType}, data))
  }

  static getLogger(): bunyan {
    if (!StructuredLogger.logger) {
      StructuredLogger.logger = this.initLogger(LogType.SystemLog)
    }
    return StructuredLogger.logger
  }
}

StructuredLogger.getLogger()
