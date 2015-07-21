class ListNode {
	payload: any;
	next: ListNode;
	last: ListNode;
	
	constructor(payload:any) {
		this.payload = payload;
		this.next = null;
		this.last = null;
	}		
}

class List {
	begin: ListNode;
	end: ListNode;
	push(payload:any) {
		var newNode = new ListNode(payload);
	    if (this.end === null) {
	      this.begin = newNode;
	      this.end = newNode;
	      return this;
	    }
	    this.end.next = newNode;
	    newNode.last = this.end;
	    this.end = newNode;
	}
}