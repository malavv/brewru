class CancelError implements Error {
  name: string = 'Cancel';
  message: string = 'Operation has been cancelled';
}
class UnimplementedError implements Error {
  name: string = 'Unimplemented';
  message: string = 'Operation not yet implemented.';
}
