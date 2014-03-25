Selectadon
=============

Selectadon allows the user to implement custom dropdowns completely styled with CSS. The generated markup is simple and can also be modified slightly per dropdown through options. No inline styles are applied so the whole appearance can be modified through the user's stylesheet.

## Installation

Include script *after* the jQuery (1.7+) library (unless you are packaging scripts somehow else):

```html
<script src="/path/to/selectadon.js"></script>

<!-- or -->

<script src="/path/to/selectadon.min.js"></script>
```

**Do not include the script directly from GitHub (http://raw.github.com/...).** The file is being served as text/plain and as such being blocked
in Internet Explorer on Windows 7 for instance (because of the wrong MIME type). Bottom line: GitHub is not a CDN.

## Usage

Just include normal ```select``` element markup and initialize the plugin on all ```select``` elements or through the use of a class on individual ```select``` elements. To title the dropdown use the first ```option``` like so ```<option val="">Dropdown Title</option>``` as you would normally. Each ```select``` should have a unique ID just as you normally would apply as well.

Example markup:
```html
<select name="my-select" id="my-select">
    <option val="">Dropdown Title</option>
    <option value="option-1">Option 1</option>
    <option value="option-2">Option 2</option>
    <option value="option-3">Option 3</option>
</select>
```

## Initialization

Just select your scroller container with jQuery and run 'selectadon()'.

```javascript
$('select').selectadon();
//or
$('.custom-select-class').selectadon();

// With custom options.
$('.custom-select-class').selectadon({
    holderClass: 'custom-select-holder', // defaults to 'sd-holder'
    openClass: 'active' // defaults to 'open'
});
```
### Options

Here are the options you can set globally or on an indivdual basis through multiple initializations or by adding ```data-sd-options``` to individual ```select``` elements. When using the data attribute the options must be passed as json like so:

```html
<select data-sd-options='{"holderClass": "custom-class"}'></select>
```

##### holderClass
Use this to set a custom class for the generated markup that holds the trigger button and dropdown list.

Type: `string`  
Default: `'sd-holder'`  

##### modifierClass
Use this to set a modifier class on the 'holder' element if you have different types of custom selects. For example, add a modifier class that will make some dropdowns have the content be center aligned and some left aligned.

Type: `string`  
Default: `''`  

##### btnClass
Use this to set a custom class on the dropdown trigger.

Type: `string`  
Default: `'sd-btn'`  

##### listClass
Use this to set a custom class on the dropdown list ```ul```.

Type: `string`  
Default: `'sd-list'`  

##### txtClass
Use this to set a custom class on the ```span``` that holds the selected option text.

Type: `string`  
Default: `'sd-text'`  

##### iconClass
Use this to set a custom class on the ```span``` that holds the icon for the dropdown trigger. Usually an arrow of some sort.

Type: `string`  
Default: `'sd-icon'`  

##### openClass
Use this to set a custom class on the holder that should apply styles for the open dropdown state.

Type: `string`  
Default: `'open'`  

##### iconFirst
Use this to specify if you'd like the ```span``` that holds the icon to come first in the trigger markup

Type: `boolean`  
Default: `'false'`  

##### btnTxt
Use this to set custom text for your dropdown title. Usually, it's the first ```option``` in your ```select``` markup with no value.

Type: `string`  
Default: `null`  

##### btnIcon
Use this to set custom markup for your icon. It can be a character code or any valid HTML. Great for injecting an element with an icon font class or pass `''` if you want to set the icon font class on the containing `span`.

Type: `string/html`  
Default: `'&#9660;'`  

##### noBtnTxt
The `span` containing your selected option text can be left out if you choose although it's recommended you not do this.

Type: `boolean`  
Default: `false`  

##### noBtnIcon
If you don't want an icon in your trigger and don't want the markup for it set this to `false`.

Type: `boolean`  
Default: `false`  

### Styling

Selectadon doesn't come with any stock styling, but there are demos that will give starter ideas and suggested base styles.

#### Default Generated HTML
```html
<div class="sd-holder" data-id-"custom-select-id">
    <!-- select element is moved inside the holder so it can be positioned over the trigger on touch devices -->
    <select name="custom-select-id" id="custom-select-id">...</select>
    <a href="#" class="sd-btn">
        <span class="sd-text">Dropdown Title</span>
        <span class="sd-icon">&#9660;</span>
    </a>
    <ul class="sd-list">
        <li><a href="#" data-value>Dropdown Title</a></li>
        <li><a href="#" data-value="option-1">Option 1</a></li>
        <li><a href="#" data-value="option-2">Option 2</a></li>
    </ul>
</div>
```

#### Suggested Base Styling For Dropdown
These are examples styles for a simple hide/show dropdown. Greater examples can be found in the demo and the SASS files. Browser compatability in regards to styling is left to the developer, but with the right styling even IE7 could be supported.

```css
.sd-holder {
    position: relative;
}
.sd-list {
    display: none;
    position: absolute;
    left: 0;
}
.open .sd-list {
    display: block;
}
```

#### Using Default Option Lists For Touch Devices
The `select` element can be hidden and positioned over the dropdown trigger on touch devices with CSS using media queries or with something like Modernizr that will set a 'touch' class for touch enabled devices. This will allow the user to trigger the natural option selector on the device.

Some method of styling the `select` element to completely cover the normal dropdown trigger is necessary, but since this is really only needed on touch devices most likely CSS transforms could be used.

Selecting an option in this manner will still change the selected option text on the trigger.
