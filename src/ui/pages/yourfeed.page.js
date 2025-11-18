export class YourFeedPage {
    
    constructor(page) {
		this.page = page;
        //поле только для чтения, продумать нейминг
		this.profileNameField = page.getByRole('navigation');
	}
}