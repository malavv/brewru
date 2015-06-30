class CancelError implements Error {
  name: string = 'Cancel';
  message: string = 'Operation has been cancelled';
}