class Log {
  private static time() : String {
    var d = new Date();
    return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds();
  }

  private static format(time: String, classname: String, msg: String) {
    return "[" + time + "]<" + classname + "> : " + msg;
  }

  public static info(classobj: any, msg: String) {
    console.info(Log.format(Log.time(), (classobj.name || "anon"), msg));
  }
  public static warn(classobj: any, msg: String) {
    console.warn(Log.format(Log.time(), (classobj.name || "anon"), msg));
  }
  public static error(classobj: any, msg: String) {
    console.error(Log.format(Log.time(), (classobj.name || "anon"), msg));
  }
}