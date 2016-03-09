class Log {
  private static time() : String {
    var d = new Date();
    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
  }

  private static format(time: String, className: String, msg: String) {
    return "[" + time + "]<" + className + "> : " + msg;
  }

  public static info(className: string, msg: string) {
    console.info(Log.format(Log.time(), (className || "anon"), msg));
  }
  public static warn(className: string, msg: string) {
    console.warn(Log.format(Log.time(), (className || "anon"), msg));
  }
  public static error(className: string, msg: string) {
    console.error(Log.format(Log.time(), (className || "anon"), msg));
  }
}