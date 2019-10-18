package CONFIG_BUNDLE_ID;

import com.reactnativenavigation.NavigationActivity;
import android.os.Bundle;
import android.support.annotation.Nullable;

public class MainActivity extends NavigationActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.splash);
    }
}
